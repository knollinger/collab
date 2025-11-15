package org.knollinger.colab.permissions.exceptions;

import java.util.UUID;

/**
 * 
 */
public class DuplicateACLException extends Exception
{
    private static final String ERR_DUPLICATE_ACL = "Es existiert bereits eine Zugriffskontroll-Liste für die Resource '%1$s'.";

    private static final long serialVersionUID = 1L;

    public DuplicateACLException(UUID uuid)
    {
        super(String.format(ERR_DUPLICATE_ACL, uuid.toString()));
    }
}
