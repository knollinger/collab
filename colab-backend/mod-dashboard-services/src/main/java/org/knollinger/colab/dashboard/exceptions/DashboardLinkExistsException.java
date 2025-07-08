package org.knollinger.colab.dashboard.exceptions;

public class DashboardLinkExistsException extends Exception
{
    private static final long serialVersionUID = 1L;

    public DashboardLinkExistsException()
    {
        super("Der Link existiert bereits im Dashboard.");
    }
}
