package org.knollinger.colab.pinwall.exc;

/**
 * 
 */
public class TechnicalPillwallException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param message
     * @param cause
     */
    public TechnicalPillwallException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
