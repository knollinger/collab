package org.knollinger.colab.user.services.impl;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;
import org.knollinger.colab.user.models.Avatar;
import org.knollinger.colab.user.services.IAvatarService;
import org.knollinger.colab.utils.io.FileDeletingInputStream;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AvatarServiceImpl implements IAvatarService
{
    private static final String SQL_GET_AVATAR = "" //
        + "select surname, lastname, avatar, avatarType from users" //
        + "  where uuid=?";

    private static final String SQL_SAVE_AVATAR = "" //
        + "update users set avatar=?, avatarType=?" //
        + "  where uuid=?";

    // Der Default-Avatar ist ein SVG-Image, in welchem die Initialen des Benutzers in einem blauen Kreis angezeigt werden.
    private static final String DEFAULT_AVATAR_SVG = "" //
        + "<svg" // 
        + "    xmlns=\"http://www.w3.org/2000/svg\"" //
        + "    xmlns:xlink=\"http://www.w3.org/1999/xlink\"" // 
        + "    xml:space=\"preserve\"" // 
        + "    style=\"shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd\"" //
        + "    viewBox=\"0 0 128 128\">" //
        + "    <g>" //
        + "        <circle style=\"fill:#9b9dff; stroke:#0000a0; stroke-width:3;\" cx=\"64\" cy=\"64\" r=\"60\" />" //
        + "        <text x=\"64\" y=\"80\" text-anchor=\"middle\" stroke=\"white\" fill=\"white\" font-size=\"48\">${INITIALS}</text>" //
        + "    </g>" //
        + "</svg>";

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
            if (!rs.next())
            {
                throw new UserNotFoundException(uuid);
            }

            String type = rs.getString("avatarType");
            in = rs.getBinaryStream("avatar");
            Avatar avatar = (in == null)
                ? this.createDefaultAvatar(rs.getString("surname"), rs.getString("lastname"))
                : this.createAvatar(type, in);
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
     * 
     * @param surName
     * @param lastName
     * @return
     */
    private Avatar createDefaultAvatar(String surName, String lastName)
    {
        StringBuilder initials = new StringBuilder();
        initials.append(surName.charAt(0)).append(lastName.charAt(0));
        String svg = DEFAULT_AVATAR_SVG.replace("${INITIALS}", initials.toString().toUpperCase());
        return new Avatar("image/svg+xml", new ByteArrayInputStream(svg.getBytes(StandardCharsets.UTF_8)));
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
            return new Avatar(type, new BufferedInputStream(new FileDeletingInputStream(tmpFile)));
        }
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
