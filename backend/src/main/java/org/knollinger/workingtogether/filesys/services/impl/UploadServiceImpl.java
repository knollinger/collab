package org.knollinger.workingtogether.filesys.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.NoSuchAlgorithmException;
import java.sql.BatchUpdateException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.exceptions.UploadException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.services.IUploadService;
import org.knollinger.workingtogether.utils.io.HashCalculatingInputStream;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadServiceImpl implements IUploadService
{
    private static final String SQL_CREATE_INODE = "" //
        + "insert into inodes" // 
        + "  set uuid=?, parent=?, name=?, size=?, type=?, hash=?, data=?";

    private static final String SQL_GET_CHILD_BY_NAME = "" //
        + "select * from inodes" //
        + "  where parent=? and name=?";

    private static final String ERR_UPLOAD_FAILED = "Der Upload in den Ordner mit der UUID '%1$s' ist technisch fehl geschlagen.";

    @Value("${blobstore.basePath}")
    private String basePath;

    @Autowired
    private IDbService dbSvc;

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

            long start = System.currentTimeMillis();
            List<INode> result = new ArrayList<>();
            List<INode> duplicates = new ArrayList<>();
            for (MultipartFile file : files)
            {
                INode node = this.handleOneFile(parentUUID, file, conn);
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

            long end = System.currentTimeMillis();
            System.err.println("single insert: " + (end - start) + "ms");
            return result;
        }
        catch (SQLException | NoSuchAlgorithmException | IOException e)
        {
            e.printStackTrace();
            String msg = String.format(ERR_UPLOAD_FAILED, parentUUID.toString());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param parentUUID
     * @param file
     * @param conn
     * @return
     * @throws SQLException 
     * @throws IOException 
     * @throws NoSuchAlgorithmException 
     */
    private INode handleOneFile(UUID parentUUID, MultipartFile file, Connection conn)
        throws SQLException, NoSuchAlgorithmException, IOException
    {
        INode result = null;
        PreparedStatement stmt = null;

        FileAndHash fileSysObj = null;
        try
        {
            UUID newUUID = UUID.randomUUID();
            fileSysObj = this.saveToFileSys(newUUID, file);

            stmt = conn.prepareStatement(SQL_CREATE_INODE);
            stmt.setString(1, newUUID.toString());
            stmt.setString(2, parentUUID.toString());
            stmt.setString(3, file.getOriginalFilename());
            stmt.setLong(4, file.getSize());
            stmt.setString(5, file.getContentType());
            stmt.setString(6, fileSysObj.hash());
            stmt.setBinaryStream(7, new FileInputStream(fileSysObj.file));

            stmt.executeUpdate();

            Timestamp now = new Timestamp(System.currentTimeMillis());
            result = INode.builder() //
                .uuid(newUUID) //
                .parent(parentUUID) //
                .name(file.getOriginalFilename()) //
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
            this.deleteFileSysObj(fileSysObj);
            this.dbSvc.closeQuitely(stmt);
        }
        return result;
    }


    /**
     * @param fileSysObj
     */
    private void deleteFileSysObj(FileAndHash fileSysObj)
    {
        if (fileSysObj != null)
        {
            fileSysObj.file.delete();
        }
    }

    /**
     * @param newUUID
     * @param multipartIn
     * @return
     * @throws IOException
     * @throws NoSuchAlgorithmException
     */
    private FileAndHash saveToFileSys(UUID newUUID, MultipartFile multipartIn) throws IOException, NoSuchAlgorithmException
    {
        File tmpFile = new File(this.basePath, newUUID.toString());
        tmpFile.createNewFile();
        try (HashCalculatingInputStream hashIn = new HashCalculatingInputStream(multipartIn.getInputStream());
            OutputStream out = new FileOutputStream(tmpFile))
        {
            IOUtils.copy(hashIn, out);
            out.flush();
            return new FileAndHash(tmpFile, hashIn.getHashAsString());
        }
        catch (IOException | NoSuchAlgorithmException e)
        {
            tmpFile.delete();
            throw e;
        }
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
                    .parent(parentId) //
                    .name(originalFilename) //
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

    /**
     * Das Daten-Objekt um ein File und dessen Hash zurück liefern zu können
     */
    private static record FileAndHash(File file, String hash)
    {
    }
}
