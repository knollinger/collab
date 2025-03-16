package org.knollinger.workingtogether.filesys.exceptions;

import java.util.UUID;

/**
 * 
 */
public class AccessDeniedException extends Exception
{

    private static final long serialVersionUID = 1L;
    private static final String ERR_ACCESS_DENID = "Du bist nicht zum Zugriff auf das Dateisystem-Objekt mit der UUID '%1$s' berechtigt.";

    /**
     * @param uuid
     */
    public AccessDeniedException(UUID uuid)
    {
        super(String.format(ERR_ACCESS_DENID, uuid.toString()));
    }
}
