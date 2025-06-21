package org.knollinger.colab.user.exceptions;

import java.util.UUID;

/**
 * 
 */
public class TechnicalGroupException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param email
     * @param cause
     */
    public TechnicalGroupException(String name, Throwable cause)
    {
        super(String.format("Technischer Fehler beim Zugriff auf die Gruppe '%1$s'.", name), cause);
    }

    /**
     * @param uuid
     * @param cause
     */
    public TechnicalGroupException(UUID uuid, Throwable cause)
    {
        super(String.format("Technischer Fehler beim Zugriff auf die Gruppe mit der UUID '%1$s'.", uuid.toString()), cause);
    }
}
