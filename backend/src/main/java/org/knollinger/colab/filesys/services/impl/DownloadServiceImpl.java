package org.knollinger.colab.filesys.services.impl;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.BlobInfo;
import org.knollinger.colab.filesys.services.IDownloadService;
import org.knollinger.colab.utils.io.FileDeletingInputStream;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DownloadServiceImpl implements IDownloadService
{
    private static final String ERR_LOAD_FILE = "Die Datei mit der UUID '%1$s' konnte aufgrund eines technischen Problems nicht geladen werden.";

    private static final String SQL_LOAD_FILE = "" //
        + "select `name`, `size`, `type`, `hash`, `data` from `inodes`" //
        + "  where `uuid`=?";

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
            InputStream in = this.getFile(uuid, type, rs.getBinaryStream("data"));

            return BlobInfo.builder() //
                .name(rs.getString("name")) //
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
     * @param in 
     * @return
     * @throws IOException 
     */
    private InputStream getFile(UUID uuid, String type, InputStream in) throws IOException
    {
        InputStream result = null;
        OutputStream out = null;

        try
        {
            if (type.equalsIgnoreCase("inode/directory"))
            {
                result = InputStream.nullInputStream();
            }
            else
            {
                File tmpFile = File.createTempFile("colab_", ".tmp");
                out = new BufferedOutputStream(new FileOutputStream(tmpFile));
                IOUtils.copy(in, out);
                out.flush();
                result = new FileDeletingInputStream(tmpFile);
            }
            return result;
        }
        finally
        {
            IOUtils.closeQuietly(out);
        }
    }
}
