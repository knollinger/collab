package org.knollinger.workingtogether.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.models.IPermissions;
import org.knollinger.workingtogether.filesys.services.ICheckPermsService;
import org.knollinger.workingtogether.filesys.services.ICopyINodeService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CopyINodeServiceImpl implements ICopyINodeService
{
    @Autowired
    private IDbService dbSvc;

    @Autowired()
    private ICheckPermsService checkPermsSvc;

    private static final String SQL_COPY = "" //
        + "insert into `inodes` ( `uuid`, `parent`, `owner`, `group`, `perms`, `name`, `size`, `type`, `data`, `hash`)" //
        + "  select ? , ?, `owner`, `group`, `perms`, ?, `size`, `type`, `data`, `hash`" //
        + "    from `inodes`" //
        + "      where `uuid` = ?";

    private static final String SQL_GET_CHILDS = "" //
        + "select `uuid`, `type` from `inodes`" //
        + "  where `parent`=?";

    private static final String SQL_GET_INODE = "" //
        + "select `uuid`, `parent`, `name`, `owner`, `group`, `perms`, `created`, `modified`, `size`, `type`" //
        + "  from inodes" //
        + "    where uuid=?";
    
    /**
     * @throws AccessDeniedException 
     *
     */
    @Override
    public List<INode> copyINodes(List<INode> inodes, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        Connection conn = null;
        List<INode> result = new ArrayList<INode>();
        List<INode> duplicates = new ArrayList<INode>();

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            this.checkPermsSvc.checkPermission(IPermissions.WRITE, target);

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
     * @throws AccessDeniedException 
     */
    private INode copyOneINode(INode inode, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException, AccessDeniedException
    {
        PreparedStatement stmt = null;

        try
        {
            UUID newUUID = UUID.randomUUID();
            stmt = conn.prepareStatement(SQL_COPY);
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, target.getUuid().toString());
            stmt.setString(3, inode.getName());
            stmt.setString(4, inode.getUuid().toString());
            if (stmt.executeUpdate() == 0)
            {
                throw new NotFoundException(inode.getUuid());
            }

            INode newINode = this.getINode(newUUID, conn);
            
            this.checkPermsSvc.checkPermission(IPermissions.READ, newINode);
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
            e.printStackTrace();
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
     * @throws AccessDeniedException 
     */
    private void copyChilds(INode parent, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException, AccessDeniedException
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

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws SQLException
     */
    private INode getINode(UUID uuid, Connection conn) throws SQLException
    {

        PreparedStatement stmt = null;
        ResultSet rs = null;
        INode result = INode.empty();

        try
        {
            stmt = conn.prepareStatement(SQL_GET_INODE);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            if (rs.next())
            {
                result = INode.builder() //
                    .uuid(uuid) //
                    .parent(UUID.fromString(rs.getString("parent"))) //
                    .name(rs.getString("name")) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group"))) //
                    .perms(rs.getInt("perms")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .size(rs.getInt("size")) //
                    .type(rs.getString("type")) //                 
                    .build();
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
