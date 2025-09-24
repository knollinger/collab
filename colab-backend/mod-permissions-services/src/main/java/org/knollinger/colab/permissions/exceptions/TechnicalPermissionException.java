package org.knollinger.colab.permissions.exceptions;

/**
 * 
 */
public class TechnicalPermissionException extends Exception
{
    private static final long serialVersionUID = 1L;

    public TechnicalPermissionException(String message)
    {
        super(message);
    }

    public TechnicalPermissionException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
