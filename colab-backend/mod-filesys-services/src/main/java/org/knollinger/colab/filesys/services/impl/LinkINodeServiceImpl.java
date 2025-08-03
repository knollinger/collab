package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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
import org.knollinger.colab.filesys.models.IPermissions;
import org.knollinger.colab.filesys.services.ICheckPermsService;
import org.knollinger.colab.filesys.services.ILinkINodeService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LinkINodeServiceImpl implements ILinkINodeService
{
    private static final String SQL_LINK_INODE = "" //
        + "insert into `inodes` ( `uuid`, `parent`, `linkTo`, `owner`, `group`, `perms`, `name`, `size`, `type`, `data`, `hash`)" //
        + "  select ? , ?, ?, `owner`, `group`, `perms`, ?, `size`, `type`, `data`, `hash`" //
        + "    from `inodes`" //
        + "      where `uuid` = ?";


    private static final String SQL_GET_INODE = "" //
        + "select `uuid`, `parent`, `linkTo`, `name`, `owner`, `group`, `perms`, `created`, `modified`, `size`, `type`" //
        + "  from inodes" //
        + "    where uuid=?";

    
    
    
    @Autowired
    private IDbService dbSvc;

    @Autowired()
    private ICheckPermsService checkPermsSvc;

    /**
     * @throws AccessDeniedException 
     *
     */
    @Override
    public List<INode> linkINodes(List<INode> inodes, INode target)
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
                INode newINode = this.linkOneINode(inode, target, conn);
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
                "Der Link-Vorgang ist aufgrund eines technischen Problems fehl geschlagen.", e);
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
    private INode linkOneINode(INode inode, INode target, Connection conn)
        throws NotFoundException, TechnicalFileSysException, AccessDeniedException
    {
        PreparedStatement stmt = null;

        try
        {
            UUID newUUID = UUID.randomUUID();
            stmt = conn.prepareStatement(SQL_LINK_INODE);
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, target.getUuid().toString());
            stmt.setString(3, inode.getUuid().toString());
            stmt.setString(4, inode.getName());
            stmt.setString(5, inode.getUuid().toString());
            
            stmt.executeUpdate();
            return this.getINode(newUUID, conn);
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            return null;
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Der Dateisystem-Link konnte nicht angelegt werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

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
                    .linkTo(this.parseNullableUUID(rs.getString("linkTo"))) //
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


    /**
     * @param string
     * @return
     */
    private UUID parseNullableUUID(String val)
    {
        UUID result = null;

        if (val != null)
        {
            result = UUID.fromString(val);
        }
        return result;
    }
}
