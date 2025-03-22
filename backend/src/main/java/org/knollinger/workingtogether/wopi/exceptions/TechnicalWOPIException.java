package org.knollinger.workingtogether.wopi.exceptions;

public class TechnicalWOPIException extends Exception
{
    private static final long serialVersionUID = 1L;

    public TechnicalWOPIException(String message)
    {
        super(message);
    }

    public TechnicalWOPIException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
