package org.knollinger.colab.utils.io;

import java.io.File;

public class FileSysUtils
{
    /**
     * @param file
     */
    public static void removeQuitely(File file)
    {
        if (file.exists())
        {
            if (file.isDirectory())
            {
                File[] childs = file.listFiles();
                for (File child : childs)
                {
                    FileSysUtils.removeQuitely(child);
                }
            }
            file.delete();
        }
    }
}
