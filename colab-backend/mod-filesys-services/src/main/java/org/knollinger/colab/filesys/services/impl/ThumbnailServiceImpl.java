package org.knollinger.colab.filesys.services.impl;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.BlobInfo;
import org.knollinger.colab.filesys.services.IThumbnailService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementiert einen {@link IThumbnailService}
 * <p>
 * Thumbnails werden in einer eigenen Tabelle 'thumbnails' gespeichert. Sollte aktuell
 * kein Thumbnail mit der gegebenen UUID gefunden werden, so wird ein solches angelegt.
 * </p>
 * <p>
 * Bei der Neuanlage werden folgende Parameter eingehalten:
 * <ul>
 * <li> Das Thumbnail ist 128*128 Pixel groß</li>
 * <li> Das entsprechend skalierte Original-Image wird in diesen Bereich zentriert</li>
 * <li> Der Hintergrund des Thumbnails ist transparent, aus diesem Grund wird PNG als Speicherformat gewählt</li>
 * </ul>
 * </p>
 */
@Service
public class ThumbnailServiceImpl implements IThumbnailService
{
    private static final String SQL_LOAD_ORIG = "select data, type from inodes where uuid=?";
    private static final String SQL_GET_THUMBNAIL = "select data, type from thumbnails where uuid=?";
    private static final String SQL_SAVE_THUMBNAIL = "insert into thumbnails set uuid=?, data=?, type=?";

    private static final int THUMB_SIZE = 128;
    
    @Autowired()
    private IDbService dbSvc;

    /**
     * Liefere das Thumbnail für die INode mit der gegebenen UUID.
     * <p>
     * Sollte kein Thumbnail existieren, so wird versucht ein solches zu erzeugen. Dazu wird
     * das originale Image geladen und auf 128*128 Pixel skaliert. Das neu erzeugte Image wird
     * als Thumbnail im Format PNG gespeichert.
     * </p>
     */
    @Override
    public BlobInfo getThumbnail(UUID uuid) throws NotFoundException, TechnicalFileSysException
    {
        try (Connection conn = this.dbSvc.openConnection();
            PreparedStatement stmt = conn.prepareStatement(SQL_GET_THUMBNAIL))
        {
            stmt.setString(1, uuid.toString());
            try (ResultSet rs = stmt.executeQuery())
            {
                // TODO: type prüfen und ggf Exception werfen!
                return rs.next() ? this.loadThumbnail(uuid, rs) : this.createThumbnail(uuid, conn);
            }
        }
        catch (SQLException | IOException e)
        {
            e.printStackTrace();
            throw new TechnicalFileSysException("thumbnail konnte nicht erzeugt werden", e);
        }
    }

    /**
     * 
     * @param uuid
     * @param rs
     * @return
     * @throws IOException
     * @throws SQLException
     */
    private BlobInfo loadThumbnail(UUID uuid, ResultSet rs) throws IOException, SQLException
    {
        try (InputStream in = rs.getBinaryStream("data"))
        {
            ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
            IOUtils.copy(in, byteOut);

            return BlobInfo.builder() //
                .contentType(rs.getString("type")) //
                .data(new ByteArrayInputStream(byteOut.toByteArray())) //
                .size(byteOut.size()) //
                .eTag(this.createETag(uuid)).build();
        }
    }

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws NotFoundException
     * @throws SQLException
     * @throws IOException
     */
    private BlobInfo createThumbnail(UUID uuid, Connection conn) throws NotFoundException, SQLException, IOException
    {
        BufferedImage original = this.loadOriginal(uuid, conn);
        BufferedImage scaled = this.scaleImage(original);

        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        ImageIO.write(scaled, "png", buf);

        ByteArrayInputStream imgSrc = new ByteArrayInputStream(buf.toByteArray());
        this.saveThumbNail(uuid, imgSrc, conn);

        imgSrc.reset();
        return BlobInfo.builder() //
            .contentType("image/png") //
            .data(imgSrc) //
            .size(buf.size()) //
            .eTag(this.createETag(uuid)).build();
    }

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws NotFoundException
     * @throws SQLException
     * @throws IOException
     */
    private BufferedImage loadOriginal(UUID uuid, Connection conn) throws NotFoundException, SQLException, IOException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_LOAD_ORIG))
        {
            stmt.setString(1, uuid.toString());
            try (ResultSet rs = stmt.executeQuery())
            {
                if (!rs.next())
                {
                    throw new NotFoundException(uuid);
                }

                try (InputStream in = rs.getBinaryStream("data"))
                {
                    return ImageIO.read(in);
                }
            }
        }
    }

    /**
     * @param original
     * @return
     */
    private BufferedImage scaleImage(BufferedImage original)
    {
        double srcWidth = original.getWidth();
        double srcHeight = original.getHeight();
        double ratio = srcWidth / srcHeight;
        
        if(ratio == 0) {
            System.err.println("???");
        }

        double targetWidth, targetHeight;
        if (srcWidth > srcHeight)
        {
            targetWidth = 128.0;
            targetHeight = 128.0 / ratio;
        }
        else
        {
            targetHeight = 128.0;
            targetWidth = 128.0 / ratio;
        }

        int height = (int)targetHeight;
        int width = (int)targetWidth;
        
        Image scaled = original.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage result = new BufferedImage(128, 128, BufferedImage.TYPE_INT_ARGB);

        int x = (128 - width) / 2;
        int y = (128 - height) / 2;
        
        result.getGraphics().drawImage(scaled, x, y, null);
        return result;
    }

    /**
     * @param uuid
     * @param imgSrc
     * @param conn
     * @throws SQLException
     */
    private void saveThumbNail(UUID uuid, ByteArrayInputStream imgSrc, Connection conn) throws SQLException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_SAVE_THUMBNAIL))
        {
            stmt.setString(1, uuid.toString());
            stmt.setBinaryStream(2, imgSrc);
            stmt.setString(3, "image/png");
            stmt.executeUpdate();
        }
    }

    /**
     * @param uuid
     * @return
     */
    private String createETag(UUID uuid)
    {
        return String.format("thumb_$1$s", uuid.toString());
    }
}
