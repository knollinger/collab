package org.knollinger.workingtogether.user.exceptions;

public class ExpiredTokenException extends Exception
{
    private static final long serialVersionUID = 1L;

    public ExpiredTokenException()
    {
        super("Das angelieferte Token ist abgelaufen.");
    }
}
