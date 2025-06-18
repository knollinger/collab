package org.knollinger.colab.user.exceptions;

import java.util.UUID;

/**
 * 
 */
public class GroupNotFoundException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param uuid
     */
    public GroupNotFoundException(UUID uuid)
    {
        super(String.format("Es existiert keine Gruppe mit der UUID '%1$s'.", uuid.toString()));
    }
}
