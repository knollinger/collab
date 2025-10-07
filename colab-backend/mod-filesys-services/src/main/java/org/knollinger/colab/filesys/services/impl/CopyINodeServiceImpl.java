package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.ICopyINodeService;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.permissions.exceptions.TechnicalPermissionException;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CopyINodeServiceImpl implements ICopyINodeService
{
    @Autowired
    private IDbService dbSvc;

    @Autowired()
    private IFileSysService inodeSvc;

    @Autowired()
    private IPermissionsService permissionsSvc;

    private static final String SQL_COPY = "" //
        + "insert into `inodes` ( `uuid`, `parent`, `linkTo`, `owner`, `group`, `perms`, `name`, `size`, `type`, `data`, `hash`)" //
        + "  select ? , ?, `linkTo`, `owner`, `group`, `perms`, ?, `size`, `type`, `data`, `hash`" //
        + "    from `inodes`" //
        + "      where `uuid` = ?";

    /**
     * @throws AccessDeniedException 
     *
     */
    @Override
    public List<INode> copyINodes(List<INode> inodes, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        List<INode> result = new ArrayList<INode>();
        List<INode> duplicates = new ArrayList<INode>();

        try(Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);

            if (!this.permissionsSvc.canEffectiveWrite(target.getAcl()))
            {
                throw new AccessDeniedException(target);
            }

            for (INode inode : inodes)
            {
                INode newINode = this.copyOneINode(inode, target, conn);
                if (newINode == null)
                {
                    duplicates.add(inode);
                }
                else
                {
                    result.add(newINode);
                }
            }

            if (duplicates.size() > 0)
            {
                throw new DuplicateEntryException(duplicates);
            }

            conn.commit();
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(
                "Der Kopier-Vorgang ist aufgrund eines technischen Problems fehl geschlagen.", e);
        }
    }

    /**
     * 
     * @param inode
     * @param target
     * @return
     * @throws SQLException 
     * @throws NotFoundException 
     * @throws TechnicalFileSysException 
     * @throws AccessDeniedException 
     */
    private INode copyOneINode(INode inode, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException, AccessDeniedException
    {
        try(PreparedStatement stmt = conn.prepareStatement(SQL_COPY))
        {
            UUID newUUID = UUID.randomUUID();
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, target.getUuid().toString());
            stmt.setString(3, inode.getName());
            stmt.setString(4, inode.getUuid().toString());
            if (stmt.executeUpdate() == 0)
            {
                throw new NotFoundException(inode.getUuid());
            }

            this.permissionsSvc.copyACLEntries(inode.getUuid(), newUUID, conn);
            INode newINode = this.inodeSvc.getINode(newUUID, conn);
            if (!this.permissionsSvc.canEffectiveRead(newINode.getAcl()))
            {
                throw new AccessDeniedException(newINode);
            }

            if (inode.isDirectory())
            {
                this.copyChilds(inode, newINode, conn);
            }
            return newINode;
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            return null;
        }
        catch (SQLException | TechnicalPermissionException e)
        {
            throw new TechnicalFileSysException("???", e);
        }
    }

    /**
     * 
     * @param parent
     * @param target
     * @param conn
     * @throws TechnicalFileSysException 
     * @throws NotFoundException 
     * @throws AccessDeniedException 
     */
    private void copyChilds(INode parent, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException, AccessDeniedException
    {
        List<INode> childs = this.inodeSvc.getAllChilds(parent.getUuid(), false, conn);
        for (INode child : childs)
        {
            this.copyOneINode(child, target, conn);
        }
    }
}
