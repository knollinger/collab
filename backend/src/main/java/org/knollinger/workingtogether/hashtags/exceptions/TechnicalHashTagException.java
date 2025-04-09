package org.knollinger.workingtogether.hashtags.exceptions;

/**
 * 
 */
public class TechnicalHashTagException extends Exception
{

    private static final long serialVersionUID = 1L;

    /**
     * @param message
     */
    public TechnicalHashTagException(String message)
    {
        super(message);
    }

    /**
     * @param message
     * @param cause
     */
    public TechnicalHashTagException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
