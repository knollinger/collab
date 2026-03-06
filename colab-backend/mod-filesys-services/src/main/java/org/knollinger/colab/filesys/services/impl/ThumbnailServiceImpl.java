package org.knollinger.colab.filesys.services.impl;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.ExifSubIFDDirectory;

/**
 * Implementiert einen {@link IThumbnailService}
 * <p>
 * Thumbnails werden in einer eigenen Tabelle 'thumbnails' gespeichert. Sollte aktuell
 * kein Thumbnail mit der gegebenen UUID gefunden werden, so wird ein solches angelegt.
 * </p>
 * <p>
 * Bei der Neuanlage werden folgende Parameter eingehalten:
 * <ul>
 * <li>Das Thumbnail ist 128*128 Pixel groß</li>
 * <li>Das entsprechend skalierte Original-Image wird in diesen Bereich zentriert</li>
 * <li>Das Image wird entsprechend ggf vorhandener Exif-Orientation rotiert</li>
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
        catch (Exception e)
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
     * @throws MetadataException 
     */
    private BlobInfo createThumbnail(UUID uuid, Connection conn)
        throws NotFoundException, SQLException, IOException, ImageProcessingException, MetadataException
    {
        File tmpFile = this.loadOriginal(uuid, conn);
        try (FileInputStream fileIn = new FileInputStream(tmpFile))
        {
            BufferedImage original = ImageIO.read(tmpFile);
            BufferedImage thumb = this.scaleImage(original);

            int rotation = this.getRotationFromExif(tmpFile);
            if (rotation != 0)
            {
                thumb = this.rotateImage(thumb, rotation);
            }

            ByteArrayOutputStream buf = new ByteArrayOutputStream();
            ImageIO.write(thumb, "png", buf);
            ByteArrayInputStream imgSrc = new ByteArrayInputStream(buf.toByteArray());
            this.saveThumbNail(uuid, imgSrc, conn);

            imgSrc.reset();
            return BlobInfo.builder() //
                .contentType("image/png") //
                .data(imgSrc) //
                .size(buf.size()) //
                .eTag(this.createETag(uuid)).build();
        }
        finally
        {
            tmpFile.delete();
        }
    }

    /**
     * Rotiere das Image um den angegebenen Grad-Wert.
     * 
     * @param thumb
     * @param rotation
     * @return
     */
    private BufferedImage rotateImage(BufferedImage thumb, int rotation)
    {
        double radian = Math.toRadians(rotation);

        BufferedImage rotatedImage = new BufferedImage(THUMB_SIZE, THUMB_SIZE, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics = rotatedImage.createGraphics();

        graphics.rotate(radian, THUMB_SIZE / 2, THUMB_SIZE / 2);

        graphics.drawImage(thumb, 0, 0, null);
        graphics.dispose();
        return rotatedImage;
    }

    /**
     * @param origTmpFile
     * @return
     * @throws ImageProcessingException
     * @throws IOException
     * @throws MetadataException
     */
    private int getRotationFromExif(File origTmpFile) throws ImageProcessingException, IOException, MetadataException
    {
        int rotation = 0;

        Metadata metadata = ImageMetadataReader.readMetadata(origTmpFile);

        Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
        if (directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION))
        {
            int orientation = directory.getInt(ExifSubIFDDirectory.TAG_ORIENTATION);
            switch (orientation)
            {
                case 1 :
                    break;

                case 2 :
                    // TODO: flip horizontal
                    break;

                case 3 :
                    rotation = 180;
                    break;

                case 4 :
                    // TODO: flip vertical
                    break;

                case 5 :
                    // then rotate 270deg, then flip vertical
                    break;
                    
                case 6 :
                    rotation = 90;
                    break;

                case 7:
                    // flip horizontal, then rotate 90deg
                    break;
                    
                case 8 :
                    rotation = 270;
                    break;

                default :
                    System.err.println("unknown orientation value " + orientation);
                    break;
            }
        }
        return rotation;
    }

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws NotFoundException
     * @throws SQLException
     * @throws IOException
     * @throws ImageProcessingException 
     */
    private File loadOriginal(UUID uuid, Connection conn)
        throws NotFoundException, SQLException, IOException, ImageProcessingException
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

                File tmp = File.createTempFile("colab_thumb_", ".tmp");
                try (InputStream in = rs.getBinaryStream("data"); OutputStream out = new FileOutputStream(tmp))
                {
                    IOUtils.copy(in, out);
                }
                return tmp;
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

        double targetWidth, targetHeight;
        if (srcWidth > srcHeight)
        {
            targetWidth = (double) THUMB_SIZE;
            targetHeight = (double) THUMB_SIZE / ratio;
        }
        else
        {
            targetHeight = (double) THUMB_SIZE;
            targetWidth = (double) THUMB_SIZE / ratio;
        }

        int height = (int) targetHeight;
        int width = (int) targetWidth;

        Image scaled = original.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage result = new BufferedImage(THUMB_SIZE, THUMB_SIZE, BufferedImage.TYPE_INT_ARGB);

        int x = (THUMB_SIZE - width) / 2;
        int y = (THUMB_SIZE - height) / 2;

        Graphics g = result.getGraphics();
        g.drawImage(scaled, x, y, null);
        g.dispose();

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
