package org.knollinger.colab.permissions.exceptions;

import java.util.UUID;

/**
 * 
 */
public class TechnicalACLException extends Exception
{
    private static final long serialVersionUID = 1L;

    private static final String ERR_MSG = "Beim Zugriff auf die Zugriffskontroll-Liste der Resource '%1$s' ist ein technisches Problem aufgetreten.";

    public TechnicalACLException(UUID uuid)
    {
        super(String.format(ERR_MSG, uuid.toString()));
    }

    public TechnicalACLException(UUID uuid, Throwable cause)
    {
        super(String.format(ERR_MSG, uuid.toString()), cause);
    }
}
