package org.knollinger.colab.filesys.services.impl;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
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
import org.knollinger.colab.filesys.exceptions.UploadException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.filesys.services.IUploadService;
import org.knollinger.colab.permissions.exceptions.DuplicateACLException;
import org.knollinger.colab.permissions.exceptions.TechnicalACLException;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.services.IPermissionsService;
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
        + "  set `uuid`=?, `parent`=?, `name`=?, `size`=?, `type`=?, `hash`=?, `data`=?";

    private static final String SQL_GET_CHILD_BY_NAME = "" //
        + "select * from `inodes`" //
        + "  where `parent`=? and `name`=?";

    private static final String ERR_UPLOAD_FAILED = "Der Upload in den Ordner mit der UUID '%1$s' ist technisch fehl geschlagen.";

    @Autowired
    private IDbService dbSvc;
    
    @Autowired
    private IFileSysService inodeSvc;
    
    @Autowired
    private IPermissionsService permsSvc;
    
    @Autowired
    private ICurrentUserService currUserSvc;

    /**
     * @throws AccessDeniedException 
     * @throws NotFoundException 
     *
     */
    @Override
    public List<INode> uploadFiles(UUID parentUUID, List<MultipartFile> files)
        throws UploadException, TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException
    {
        try(Connection conn = this.dbSvc.openConnection())
        {
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
    }

    @Override
    public List<INode> uploadFiles(UUID parentUUID, List<MultipartFile> files, Connection conn)
        throws UploadException, TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException
    {
        try
        {
            List<UUID> resultIds = new ArrayList<>();
            List<INode> duplicates = new ArrayList<>();
            for (MultipartFile file : files)
            {
                UUID newUUID = this.handleOneFile(parentUUID, file, this.currUserSvc.getUser(), conn);
                if (newUUID != null)
                {
                    resultIds.add(newUUID);
                }
                else
                {
                    duplicates.add(this.getChildByName(parentUUID, file.getOriginalFilename(), conn)); // TODO: inodeSvc benutzen!
                }
            }

            if (duplicates.size() > 0)
            {
                throw new DuplicateEntryException(duplicates);
            }

            conn.commit();
            
            List<INode> result = new ArrayList<>();
            for (UUID resourceId: resultIds)
            {
                result.add(this.inodeSvc.getINode(resourceId, conn));
            }
            return result;
        }
        catch (SQLException | NoSuchAlgorithmException | IOException | TechnicalACLException | DuplicateACLException e)
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
     * @throws TechnicalACLException 
     * @throws DuplicateACLException 
     */
    private UUID handleOneFile(UUID parentUUID, MultipartFile file, User user, Connection conn)
        throws SQLException, NoSuchAlgorithmException, IOException, TechnicalACLException, DuplicateACLException
    {
        UUID result = null;
        try(PreparedStatement stmt = conn.prepareStatement(SQL_CREATE_INODE))
        {
            UUID newUUID = UUID.randomUUID();
            UUID userId = user.getUserId();
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, userId.toString());
            stmt.setString(3, file.getOriginalFilename());
            stmt.setLong(4, file.getSize());
            stmt.setString(5, file.getContentType());
            stmt.setString(6, ""); // TODO: Hash muss berechnet werden
            stmt.setBinaryStream(7, new BufferedInputStream(file.getInputStream()));
            stmt.executeUpdate();
            
            ACL acl = ACL.createOwnerACL(userId);
            this.permsSvc.createACL(newUUID, acl, conn);
            
            result = newUUID;
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            // es existiert bereits eine INode mit diesem Namen im Parent!
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
