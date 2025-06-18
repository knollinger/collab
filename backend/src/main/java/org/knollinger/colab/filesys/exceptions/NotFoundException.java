package org.knollinger.colab.filesys.exceptions;

import java.util.UUID;

/**
 * 
 */
public class NotFoundException extends Exception
{
    private static final long serialVersionUID = 1L;

    public NotFoundException(UUID uuid)
    {
        super(String.format("Es existiert kein Objekt mit der UUID '%1$s'", uuid));
    }
}
