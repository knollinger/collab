package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.services.ICalAttachmentsService;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.models.IPermissions;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.filesys.services.IUploadService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * All about FileUploads für CalendarEvents.
 * 
 * Im End-Effekt werden mit einem CalEvent Links auf INode-Objekte
 * verknüft. Für "normale" INodes ist das auch kein Problem...
 * 
 * Um auch lokale Files in ein Event hochladen zu können, wird im
 * HomeDir des Benutzers ein versteckter Folder ".calendar_attachments"
 * angelegt. Unter diesem Folder wird für jedes Event ein Folder angelegt,
 * dessen Namen der UUID des Events entspricht. In diesen Folder werden 
 * Uploads abgelegt.
 * 
 * 
 */
@Service
public class CalAttachmentsServiceImpl implements ICalAttachmentsService
{
    private static final String FOLDER_NAME = ".calendar_attachments";

    private static final String SQL_GET_ALL_ATTACHMENTS = "" //
        + "select `uuid`, `name`, `parent`, `owner`, `group`, `perms`, `size`, `type`, `created`, `modified` from `inodes`" //
        + "  where `uuid` in (" //
        + "    select inodeId from `calendar_attachments`" //
        + "      where `eventId`=?" //
        + "  )";

    private static final String SQL_CREATE_ATTACHMENT_LINK = "" //
        + "insert into `calendar_attachments`" //
        + "  set `eventId`=?, `inodeId`=?";

    @Autowired
    private ICurrentUserService currUserSvc;

    @Autowired
    private IDbService dbSvc;

    @Autowired()
    private IUploadService uploadSvc;

    @Autowired()
    private IFileSysService fileSysSvc;

    /**
     *
     */
    @Override
    public List<INode> getAttachments(UUID eventId) throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_ATTACHMENTS);
            stmt.setString(1, eventId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INode inode = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .name(rs.getString("name")) //
                    .parent(UUID.fromString(rs.getString("parent"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group")))//
                    .perms(rs.getShort("perms")) //
                    .type(rs.getString("type")) //
                    .size(rs.getLong("size")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
                result.add(inode);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException("Die Anhänge für diesen Termin konnten nicht geladen werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);

        }
    }

    @Override
    public List<INode> uploadFiles(UUID eventId, List<MultipartFile> files)
        throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            INode attachmentFolder = this.getEventAttachmentsBaseFolder(eventId, conn);

            List<INode> result = this.uploadSvc.uploadFiles(attachmentFolder.getUuid(), files);
            this.createEventLinks(eventId, result, conn);

            conn.commit();
            return result;
        }
        catch (Exception e)
        {
            throw new TechnicalCalendarException("Die Datei-Anhänge konnten nicht gespeichert werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param eventId
     * @param nodes
     * @param conn
     * @throws SQLException
     */
    private void createEventLinks(UUID eventId, List<INode> nodes, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_CREATE_ATTACHMENT_LINK);

            for (INode node : nodes)
            {
                stmt.setString(1, eventId.toString());
                stmt.setString(2, node.getUuid().toString());
                stmt.executeUpdate();
            }
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * Ermittle den Folder mit den Attachments für das gegebene Event. Sollte 
     * kein solcher Folder existieren, so wird er angelegt.
     * 
     * Die Besonderheit dieses Folders ist es, das der Name des Folders <b>und</b> 
     * die UUID der EventId entsprechen.
     * 
     * @param eventId
     * @param conn
     * @return
     * @throws TechnicalCalendarException
     */
    private INode getEventAttachmentsBaseFolder(UUID eventId, Connection conn) throws TechnicalCalendarException {
        
        
        INode base = this.getCalAttachmentsBaseFolder(conn);
        return this.getOrCreateFolder(base.getUuid(), eventId.toString(), conn);
    }
    
    private INode getCalAttachmentsBaseFolder(Connection conn) throws TechnicalCalendarException {
        
        UUID user = this.currUserSvc.get().getUser().getUserId();
        return this.getOrCreateFolder(user, FOLDER_NAME, conn);
        
    }
    
    /**
     * @param parentId
     * @param name
     * @return
     * @throws TechnicalCalendarException
     */
    private INode getOrCreateFolder(UUID parentId, String name, Connection conn) throws TechnicalCalendarException
    {
        try
        {
            INode result = this.fileSysSvc.getChildByName(parentId, name, IPermissions.WRITE, conn);
            if (result == null)
            {
                result = this.fileSysSvc.createFolder(parentId, name, conn);
            }
            return result;
        }
        catch (Exception e)
        {
            throw new TechnicalCalendarException("???", e);
        }
    }
    
    
}
