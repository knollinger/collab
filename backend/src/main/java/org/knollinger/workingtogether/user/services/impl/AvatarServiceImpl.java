package org.knollinger.workingtogether.user.services.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.exceptions.UserNotFoundException;
import org.knollinger.workingtogether.user.models.Avatar;
import org.knollinger.workingtogether.user.services.IAvatarService;
import org.knollinger.workingtogether.utils.io.FileDeletingInputStream;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AvatarServiceImpl implements IAvatarService
{
    private static final String SQL_GET_AVATAR = "" //
        + "select avatar, avatarType from users" //
        + "  where uuid=?";
    
    private static final String SQL_SAVE_AVATAR = "" //
        + "update users set avatar=?, avatarType=?" //
        + "  where uuid=?";

    @Autowired
    private IDbService dbService;

    /**
     *
     */
    @Override
    public Avatar getAvatar(UUID uuid) throws UserNotFoundException, TechnicalUserException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        InputStream in = null;

        try
        {
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_GET_AVATAR);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();

            Avatar avatar;
            if (!rs.next())
            {
                avatar = this.getDefaultAvatar();
            }
            else
            {
                String type = rs.getString("avatarType");
                in = rs.getBinaryStream("avatar");
                avatar = (in == null) ? this.getDefaultAvatar() : this.createAvatar(type, in);
            }
            return avatar;
        }
        catch (SQLException | IOException e)
        {
            String msg = String.format(
                "Der Avatar des Benutzers '%1%s' konnte aufgrund eines technischen Problems nicht geladen werden",
                uuid.toString());
            throw new TechnicalUserException(msg, e);
        }
        finally
        {
            IOUtils.closeQuietly(in);
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * @param type
     * @param in
     * @return
     * @throws IOException
     */
    private Avatar createAvatar(String type, InputStream in) throws IOException
    {
        File tmpFile = File.createTempFile("wtg_", ".tmp");
        try (OutputStream out = new FileOutputStream(tmpFile))
        {

            IOUtils.copy(in, out);
            out.close();
            return new Avatar(type, new FileDeletingInputStream(tmpFile));
        }
    }

    /**
     * @return
     */
    private Avatar getDefaultAvatar()
    {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("static/default-avatar.svg");
        return new Avatar("image/svg+xml", in);
    }

    /**
     *
     */
    @Override
    public void saveAvatar(UUID uuid, MultipartFile avatar) throws UserNotFoundException, TechnicalUserException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try (InputStream in = avatar.getInputStream())
        {
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_SAVE_AVATAR);
            stmt.setBinaryStream(1, in);
            stmt.setString(2, avatar.getContentType());
            stmt.setString(3, uuid.toString());
            if (stmt.executeUpdate() == 0)
            {
                throw new UserNotFoundException(uuid);
            }
        }
        catch (SQLException | IOException e)
        {
            throw new TechnicalUserException(uuid, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);

        }
    }
}
