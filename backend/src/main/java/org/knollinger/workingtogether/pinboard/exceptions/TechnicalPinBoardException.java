package org.knollinger.workingtogether.pinboard.exceptions;

/**
 * 
 */
public class TechnicalPinBoardException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param message
     * @param cause
     */
    public TechnicalPinBoardException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
