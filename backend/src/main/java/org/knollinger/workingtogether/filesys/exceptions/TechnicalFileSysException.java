package org.knollinger.workingtogether.filesys.exceptions;

/**
 * 
 */
public class TechnicalFileSysException extends Exception
{
    private static final long serialVersionUID = 1L;

    public TechnicalFileSysException(String msg)
    {
        super(msg);
    }

    public TechnicalFileSysException(String msg, Throwable cause)
    {
        super(msg, cause);
    }
}
