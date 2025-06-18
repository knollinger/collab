package org.knollinger.colab.user.exceptions;

public class InvalidTokenException extends Exception
{

    private static final long serialVersionUID = 1L;

    public InvalidTokenException()
    {
        super("Das angelieferte Token ist ungültig.");
    }
}
