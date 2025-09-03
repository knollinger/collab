package org.knollinger.colab.pinwall.exc;

/**
 * 
 */
public class TechnicalPinwallException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param message
     * @param cause
     */
    public TechnicalPinwallException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
