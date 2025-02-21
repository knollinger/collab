package org.knollinger.workingtogether.filesys.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.BlobInfo;
import org.knollinger.workingtogether.filesys.services.IDownloadService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DownloadServiceImpl implements IDownloadService
{
    private static final String ERR_LOAD_FILE = "Die Datei mit der UUID '%1$s' konnte aufgrund eines technischen Problems nicht geladen werden.";

    private static final String SQL_LOAD_FILE = "" //
        + "select size, type, hash from inodes" //
        + "  where uuid=?";

    @Value("${blobstore.basePath}")
    private String basePath;

    @Autowired
    private IDbService dbSvc;

    @Override
    public BlobInfo getFileContent(UUID uuid) throws TechnicalFileSysException, NotFoundException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_LOAD_FILE);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new NotFoundException(uuid);
            }

            String type = rs.getString("type");
            InputStream in = this.getFile(uuid, type);

            return BlobInfo.builder() //
                .contentType(type) //
                .size(rs.getLong("size")) //
                .eTag(rs.getString("hash")) //
                .data(in) //
                .build();

        }
        catch (SQLException | IOException e)
        {
            String msg = String.format(ERR_LOAD_FILE, uuid.toString());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public BlobInfo downloadFiles(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException
    {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @param uuid
     * @return
     * @throws FileNotFoundException 
     */
    private InputStream getFile(UUID uuid, String type) throws FileNotFoundException
    {
        InputStream in;
        if (type.equalsIgnoreCase("inode/directory"))
        {
            in = InputStream.nullInputStream();
        }
        else
        {
            File file = new File(this.basePath, uuid.toString());
            in = new FileInputStream(file);
        }
        return in;
    }
}
