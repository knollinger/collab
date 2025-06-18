package org.knollinger.colab.user.exceptions;

import java.util.UUID;

/**
 * 
 */
public class TechnicalUserException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param email
     * @param cause
     */
    public TechnicalUserException(String email, Throwable cause)
    {
        super(String.format("Technischer Fehler beim Zugriff auf den Benutzer '%1$s'.", email), cause);
    }

    /**
     * @param uuid
     * @param cause
     */
    public TechnicalUserException(UUID uuid, Throwable cause)
    {
        super(String.format("Technischer Fehler beim Zugriff auf den Benutzer mit der UUID '%1$s'.", uuid.toString()), cause);
    }
}
