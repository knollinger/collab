package org.knollinger.workingtogether.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.services.ICopyINodeService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CopyINodeServiceImpl implements ICopyINodeService
{
    @Autowired
    private IDbService dbSvc;

    private static final String SQL_COPY = "" //
        + "insert into `inodes` ( `uuid`, `parent`, `owner`, `group`, `perms`, `name`, `size`, `type`, `data`, `hash`)" //
        + "  select ? , ?, `owner`, `group`, `perms`, `name`, `size`, `type`, `data`, `hash`" //
        + "    from `inodes`" //
        + "      where `uuid` = ?";

    private static final String SQL_GET_CHILDS = "" //
        + "select `uuid`, `type` from `inodes`" //
        + "  where `parent`=?";

    /**
     *
     */
    @Override
    public List<INode> copyINodes(List<INode> inodes, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException
    {
        Connection conn = null;
        List<INode> result = new ArrayList<INode>();
        List<INode> duplicates = new ArrayList<INode>();

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

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
        finally
        {
            this.dbSvc.closeQuitely(conn);
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
     */
    private INode copyOneINode(INode inode, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException
    {
        PreparedStatement stmt = null;

        try
        {
            UUID newUUID = UUID.randomUUID();
            stmt = conn.prepareStatement(SQL_COPY);
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, target.getUuid().toString());
            stmt.setString(3, inode.getUuid().toString());
            if (stmt.executeUpdate() == 0)
            {
                throw new NotFoundException(inode.getUuid());
            }


            Timestamp now = new Timestamp(System.currentTimeMillis());
            INode newINode = INode.builder() //
                .uuid(newUUID) //
                .parent(target.getUuid()) //
                .name(inode.getName()) //
                .owner(inode.getOwner()) //
                .group(inode.getGroup()) //
                .perms(inode.getPerms()) //
                .created(now) //
                .modified(now) //
                .size(inode.getSize()) //
                .type(inode.getType()) //
                .build();

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
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("???", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * 
     * @param parent
     * @param target
     * @param conn
     * @throws TechnicalFileSysException 
     * @throws NotFoundException 
     */
    private void copyChilds(INode parent, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException
    {
        try
        {
            List<INode> childs = this.getChilds(parent, conn);
            for (INode child : childs)
            {
                this.copyOneINode(child, target, conn);
            }
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("", e);
        }
    }

    /**
     * @param parent
     * @param conn
     * @return
     * @throws SQLException 
     */
    private List<INode> getChilds(INode parent, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<INode> result = new ArrayList<INode>();

        try
        {
            stmt = conn.prepareStatement(SQL_GET_CHILDS);
            stmt.setString(1, parent.getUuid().toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INode inode = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .type(rs.getString("type")) //
                    .build();
                result.add(inode);
            }
            return result;
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }
}
