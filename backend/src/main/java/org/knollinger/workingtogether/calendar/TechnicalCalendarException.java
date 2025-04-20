package org.knollinger.workingtogether.calendar;

/**
 * 
 */
public class TechnicalCalendarException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param message
     * @param cause
     */
    public TechnicalCalendarException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
