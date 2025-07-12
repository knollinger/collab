package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.services.ICalAttachmentsService;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.ICheckPermsService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class CalAttachmentsServiceImpl implements ICalAttachmentsService
{
    private static final String FOLDER_NAME = ".calendar_attachments";
    
    private static final String SQL_GET_ATTACHMENTS_FOLDER = "" //
        + "select `uuid`, `name`, `parent`, `group`, `perms`, `size`, `type`, `created`, `modified` from `inodes`" //
        + "  where `owner`=? and `name`=?";

    private static final String SQL_CREATE_ATTACHMENTS_FOLDER = "" //
        + "insert into inodes" //
        + "  set `uuid`=?, `name`=?, `parent`=?, `owner`=?, `group`=?, `perms`=?, `type`=?, `size`=?";

    @Autowired
    private ICurrentUserService currUserSvc;

    @Autowired
    private IDbService dbSvc;

    @Autowired()
    private ICheckPermsService checkPermsSvc;

    /**
     *
     */
    @Override
    public INode getAttachmentsFolder() throws TechnicalCalendarException
    {
        Connection conn = null;

        try
        {
            UUID currUser = this.currUserSvc.get().getUser().getUserId();

            conn = this.dbSvc.openConnection();
            INode inode = this.getAttachmentsFolder(currUser, conn);
            if (inode == null)
            {
                inode = this.createAttachmentsFolder(currUser, conn);
            }
            return inode;
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            throw new TechnicalCalendarException("Der Ordner für Kalender-Anhänge konnte nicht ermittelt werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param currUser
     * @param conn
     * @return
     * @throws SQLException 
     */
    private INode getAttachmentsFolder(UUID currUser, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            INode result = null;

            stmt = conn.prepareStatement(SQL_GET_ATTACHMENTS_FOLDER);
            stmt.setString(1, currUser.toString());
            stmt.setString(2, FOLDER_NAME);
            rs = stmt.executeQuery();
            if (rs.next())
            {
                result = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(UUID.fromString(rs.getString("parent"))) //
                    .owner(currUser) //
                    .group(UUID.fromString(rs.getString("group")))//
                    .perms(rs.getShort("perms")) //
                    .name(rs.getString("name")) //
                    .type(rs.getString("type")) //
                    .size(rs.getLong("size")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
                result.setEffectivePerms(this.checkPermsSvc.getEffectivePermissions(result));
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
     * @param currUser
     * @param conn
     * @return
     * @throws SQLException
     */
    private INode createAttachmentsFolder(UUID currUser, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            UUID uuid = UUID.randomUUID();
            
            stmt = conn.prepareStatement(SQL_CREATE_ATTACHMENTS_FOLDER);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, FOLDER_NAME);
            stmt.setString(3, currUser.toString());
            stmt.setString(4, currUser.toString());
            stmt.setString(5, currUser.toString());
            stmt.setInt(6, 0766);
            stmt.setString(7, "inode/directory");
            stmt.setInt(8, 0);
            stmt.executeUpdate();
            return this.getAttachmentsFolder(currUser, conn);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }

}
