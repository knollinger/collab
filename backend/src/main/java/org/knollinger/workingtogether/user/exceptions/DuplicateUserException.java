package org.knollinger.workingtogether.user.exceptions;

/**
 * 
 */
public class DuplicateUserException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param email
     */
    public DuplicateUserException(String email)
    {
        super(String.format("Es existiert bereits ein Benutzer mit der Email '%1$s'.", email));
    }
}
