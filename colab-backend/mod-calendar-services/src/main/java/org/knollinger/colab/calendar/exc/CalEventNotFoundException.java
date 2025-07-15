package org.knollinger.colab.calendar.exc;

import java.util.UUID;

/**
 * 
 */
public class CalEventNotFoundException extends Exception
{
    private static final long serialVersionUID = 1L;
    
    private static final String ERR_NOT_FOUND = "" //
        + "Der Kalender-Eintrag mit der UUID '%1$s' konnte nicht gefunden werden.";

    /**
     * @param message
     * @param cause
     */
    public CalEventNotFoundException(UUID uuid)
    {
        super(String.format(ERR_NOT_FOUND, uuid.toString()));
    }
}
