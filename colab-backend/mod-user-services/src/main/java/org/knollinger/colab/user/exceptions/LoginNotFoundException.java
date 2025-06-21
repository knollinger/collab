package org.knollinger.colab.user.exceptions;

/**
 * Signalisiert einen nicht gefundenen Benutzer
 */
public class LoginNotFoundException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param email
     */
    public LoginNotFoundException(String email)
    {
        super(String.format("Der Benutzer '%1$s' wurde nicht gefunden oder das Kennwort ist falsch.", email));
    }
}
