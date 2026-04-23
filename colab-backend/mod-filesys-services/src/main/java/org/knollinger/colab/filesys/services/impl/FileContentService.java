package org.knollinger.colab.filesys.services.impl;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.IFileContentService;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileContentService implements IFileContentService
{
    private static String SQL_SAVE_CONTENT = """
        update inodes set data=?, size=?, type=?
           where uuid=?
        """;

    @Autowired()
    private IDbService dbSvc;

    @Autowired()
    private IFileSysService inodeSvc;

    @Override
    public INode saveContent(UUID uuid, MultipartFile file) throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        try (Connection conn = this.dbSvc.openConnection();
            PreparedStatement stmt = conn.prepareStatement(SQL_SAVE_CONTENT))
        {
            stmt.setBinaryStream(1, file.getInputStream());
            stmt.setLong(2,  file.getSize());
            stmt.setString(3, file.getContentType());
            stmt.setString(4, uuid.toString());
            stmt.executeUpdate();
            return this.inodeSvc.getINode(uuid);
        }
        catch (SQLException | IOException e)
        {
            throw new TechnicalFileSysException("unable to save inode content", e);
        }
    }
}
