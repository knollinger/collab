package org.knollinger.colab.filesys.exceptions;

import java.util.UUID;

import org.knollinger.colab.filesys.models.INode;

/**
 * 
 */
public class AccessDeniedException extends Exception
{

    private static final long serialVersionUID = 1L;
    private static final String ERR_ACCESS_DENID_UUID = "Du bist nicht zum Zugriff auf das Dateisystem-Objekt mit der UUID '%1$s' berechtigt.";
    private static final String ERR_ACCESS_DENID_NAME = "Du bist nicht zum Zugriff auf das Dateisystem-Objekt '%1$s' berechtigt.";

    /**
     * @param uuid
     */
    public AccessDeniedException(UUID uuid)
    {
        super(String.format(ERR_ACCESS_DENID_UUID, uuid.toString()));
    }

    /**
     * @param uuid
     */
    public AccessDeniedException(INode inode)
    {
        super(String.format(ERR_ACCESS_DENID_NAME, inode.getName()));
    }

}
