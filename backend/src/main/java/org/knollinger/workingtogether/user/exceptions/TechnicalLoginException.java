package org.knollinger.workingtogether.user.exceptions;

public class TechnicalLoginException extends Exception
{
    private static final long serialVersionUID = 1L;

    public TechnicalLoginException(String email, Throwable cause)
    {
        super(String.format("Beim Login des Benutzers '%1$s' ist ein technischer Fehler aufgetreten", email), cause);
    }
}
