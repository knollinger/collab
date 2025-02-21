package org.knollinger.workingtogether.user.exceptions;

import java.util.UUID;

/**
 * 
 */
public class UserNotFoundException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param uuid
     */
    public UserNotFoundException(UUID uuid)
    {
        super(String.format("Es existiert kein Benutzer mit der UUID '%1$s'.", uuid.toString()));
    }

    /**
     * @param email
     */
    public UserNotFoundException(String email)
    {
        super(String.format("Es existiert kein Benutzer mit der Email '%1$s'.", email));
    }
}
