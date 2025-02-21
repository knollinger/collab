package org.knollinger.workingtogether.utils.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Erzeugt einen {@link InputStream} für ein File.
 * 
 * Beim close() wird das File gelöscht.
 */
public class FileDeletingInputStream extends InputStream
{
    private File file;
    private InputStream source;

    /**
     * 
     * @param file
     * @throws IOException
     */
    public FileDeletingInputStream(File file) throws IOException
    {
        this.source = new FileInputStream(file);
        this.file = file;
    }

    /**
     * 
     */
    @Override
    public void close()
    {
        this.file.delete();
    }

    @Override
    public int read() throws IOException
    {
        return this.source.read();
    }
}
