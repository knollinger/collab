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
import org.knollinger.colab.filesys.services.IMoveINodeService;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MoveINodeServiceImpl implements IMoveINodeService
{
    private static final String SQL_MOVE_INODE = """
        update `inodes` set `parent`=?, `name`=?
          where `uuid`=?
        """;

    @Autowired
    private IDbService dbSvc;

    @Autowired
    private IPermissionsService permsSvc;

    private FileSysUtils fileSysUtils = new FileSysUtils();

    /**
     *
     */
    @Override
    public List<INode> moveINodes(List<INode> toMove, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);
            List<INode>  result = this.moveINodes(toMove, target, conn);
            conn.commit();
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Die Filesystem-Objekte konnten nicht verschoben werden.", e);
        }
    }

    /**
     *
     */
    @Override
    public List<INode> moveINodes(List<INode> toMove, INode target, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        UUID resolvedTargetId = this.fileSysUtils.resolveLink(target.getUuid(), conn);
        INode resolvedTarget = this.fileSysUtils.getINode(resolvedTargetId, conn);
        
        if (!this.permsSvc.canEffectiveWrite(resolvedTarget.getAcl()))
        {
            throw new AccessDeniedException(target);
        }

        try (PreparedStatement stmt = conn.prepareStatement(SQL_MOVE_INODE))
        {
            List<INode> result = new ArrayList<>();
            for (INode iNode : toMove)
            {
                this.checkMoveAllowed(iNode, resolvedTarget, conn);

                stmt.setString(1, resolvedTarget.getUuid().toString());
                stmt.setString(2, iNode.getName());
                stmt.setString(3, iNode.getUuid().toString());
                if (stmt.executeUpdate() == 0)
                {
                    throw new NotFoundException(iNode.getUuid());
                }
                result.add(this.fileSysUtils.getINode(iNode.getUuid(), conn));
            }
            return result;
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateEntryException(toMove);
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(
                "Das verschieben des Objektes konnte aufgrund eines technischen Fehlers nicht durchgeführt werden.", e);
        }
    }

    /**
     * @param src
     * @param target
     * @param conn
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException
     */
    private void checkMoveAllowed(INode src, INode target, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        //        List<INode> path = this.fileSysUtils.getPath(target.getUuid(), conn);
        //        for (INode iNode : path)
        //        {
        //            if (iNode.getUuid().equals(src.getUuid()))
        //            {
        //                // TODO: throw something
        //            }
        //        }
    }
}
