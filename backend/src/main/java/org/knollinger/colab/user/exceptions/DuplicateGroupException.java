package org.knollinger.colab.user.exceptions;

/**
 * 
 */
public class DuplicateGroupException extends Exception
{
    private static final long serialVersionUID = 1L;

    /**
     * @param email
     */
    public DuplicateGroupException(String name)
    {
        super(String.format("Es existiert bereits eine Gruppe mit dem Namen'%1$s'.", name));
    }
}
