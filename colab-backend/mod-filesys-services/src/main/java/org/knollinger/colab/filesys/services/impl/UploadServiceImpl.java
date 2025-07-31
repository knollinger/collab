package org.knollinger.colab.filesys.services.impl;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.exceptions.UploadException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.IUploadService;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadServiceImpl implements IUploadService
{
    private static final String SQL_CREATE_INODE = "" //
        + "insert into `inodes`" // 
        + "  set `uuid`=?, `parent`=?, `owner`=?, `group`=?, `perms`=?, `name`=?, `size`=?, `type`=?, `hash`=?, `data`=?";

    private static final String SQL_GET_CHILD_BY_NAME = "" //
        + "select * from `inodes`" //
        + "  where `parent`=? and `name`=?";

    private static final String ERR_UPLOAD_FAILED = "Der Upload in den Ordner mit der UUID '%1$s' ist technisch fehl geschlagen.";

    private static final short DEFAULT_PERMISSION = 0770; // read, write, delete für owner und gruppe
    
    @Autowired
    private IDbService dbSvc;
    
    @Autowired
    private ICurrentUserService currUserSvc;

    /**
     *
     */
    @Override
    public List<INode> uploadFiles(UUID parentUUID, List<MultipartFile> files)
        throws UploadException, TechnicalFileSysException, DuplicateEntryException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);
            
            List<INode> result = this.uploadFiles(parentUUID, files, conn);
            conn.commit();
            
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_UPLOAD_FAILED, parentUUID.toString());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    @Override
    public List<INode> uploadFiles(UUID parentUUID, List<MultipartFile> files, Connection conn)
        throws UploadException, TechnicalFileSysException, DuplicateEntryException
    {
        try
        {
            List<INode> result = new ArrayList<>();
            List<INode> duplicates = new ArrayList<>();
            for (MultipartFile file : files)
            {
                INode node = this.handleOneFile(parentUUID, file, this.currUserSvc.getUser(), conn);
                if (node != null)
                {
                    result.add(node);
                }
                else
                {
                    duplicates.add(this.getChildByName(parentUUID, file.getOriginalFilename(), conn));
                }
            }

            if (duplicates.size() > 0)
            {
                throw new DuplicateEntryException(duplicates);
            }

            conn.commit();
            return result;
        }
        catch (SQLException | NoSuchAlgorithmException | IOException e)
        {
            e.printStackTrace();
            String msg = String.format(ERR_UPLOAD_FAILED, parentUUID.toString());
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     * 
     * @param parentUUID
     * @param file
     * @param user
     * @param conn
     * @return
     * @throws SQLException
     * @throws NoSuchAlgorithmException
     * @throws IOException
     */
    private INode handleOneFile(UUID parentUUID, MultipartFile file, User user, Connection conn)
        throws SQLException, NoSuchAlgorithmException, IOException
    {
        INode result = null;
        PreparedStatement stmt = null;

        try
        {
            UUID newUUID = UUID.randomUUID();

            UUID userId = user.getUserId();
            stmt = conn.prepareStatement(SQL_CREATE_INODE);
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, parentUUID.toString());
            stmt.setString(3, userId.toString());
            stmt.setString(4, userId.toString());
            stmt.setShort(5, UploadServiceImpl.DEFAULT_PERMISSION);
            stmt.setString(6, file.getOriginalFilename());
            stmt.setLong(7, file.getSize());
            stmt.setString(8, file.getContentType());
            stmt.setString(9, ""); // TODO: Hash muss berechnet werden
            stmt.setBinaryStream(10, new BufferedInputStream(file.getInputStream()));

            stmt.executeUpdate();

            Timestamp now = new Timestamp(System.currentTimeMillis());
            result = INode.builder() //
                .uuid(newUUID) //
                .parent(parentUUID) //
                .name(file.getOriginalFilename()) //
                .owner(userId) //
                .group(userId) //
                .size(file.getSize()) //
                .type(file.getContentType()) //
                .created(now) //
                .modified(now) //
                .build();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            // es existiert bereits eine INode mit diesem Namen im Parent!
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
        return result;
    }

    /**
     * @param parentId
     * @param originalFilename
     * @param conn
     * @return
     * @throws SQLException
     */
    private INode getChildByName(UUID parentId, String originalFilename, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        INode result = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_CHILD_BY_NAME);
            stmt.setString(1, parentId.toString());
            stmt.setString(2, originalFilename);
            rs = stmt.executeQuery();
            if (rs.next())
            {
                result = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .name(originalFilename) //
                    .parent(parentId) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group"))) //
                    .perms(rs.getShort("perms")) //
                    .size(rs.getLong("size")) //
                    .type(rs.getString("type")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
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
