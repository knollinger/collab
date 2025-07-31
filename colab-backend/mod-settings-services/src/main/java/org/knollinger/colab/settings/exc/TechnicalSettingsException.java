package org.knollinger.colab.settings.exc;

public class TechnicalSettingsException extends Exception
{
    private static final long serialVersionUID = 1L;

    public TechnicalSettingsException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
