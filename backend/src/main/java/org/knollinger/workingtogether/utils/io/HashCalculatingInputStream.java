package org.knollinger.workingtogether.utils.io;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 
 */
public class HashCalculatingInputStream extends InputStream
{
    private InputStream source;
    private MessageDigest digest;

    /**
     * 
     * @param src
     * @throws NoSuchAlgorithmException 
     */
    public HashCalculatingInputStream(InputStream src) throws NoSuchAlgorithmException
    {
        this.source = src;
        this.digest = MessageDigest.getInstance("SHA256");
    }

    /**
     * 
     */
    @Override
    public int read() throws IOException
    {
        int rc = this.source.read();
        if (rc != -1)
        {
            digest.update((byte) rc);
        }
        return rc;
    }

    /**
     *
     */
    public int read(byte[] buf) throws IOException
    {
        return this.source.read(buf, 0, buf.length);
    }

    /**
     *
     */
    public int read(byte[] buf, int off, int len) throws IOException
    {
        int read = this.source.read(buf, off, len);
        if (read != -1)
        {
            digest.update(buf, 0, read);
        }
        return read;
    }

    /**
     * 
     * @return
     */
    public byte[] getHash()
    {
        return this.digest.digest();
    }

    /**
     * 
     * @return
     */
    public String getHashAsString()
    {
        byte[] hash = this.getHash();
        StringBuilder result = new StringBuilder();

        for (byte b : hash)
        {
            result.append(String.format("%1$02x", b));
        }
        return result.toString();
    }
}
