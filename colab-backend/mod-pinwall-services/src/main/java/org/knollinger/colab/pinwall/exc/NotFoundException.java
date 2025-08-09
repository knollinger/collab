package org.knollinger.colab.pinwall.exc;

import java.util.UUID;

/**
 * 
 */
public class NotFoundException extends Exception
{
    private static final long serialVersionUID = 1L;
    private static final String ERR_NOT_FOUND = "Das PostIT mit der UUUD '%1$s' konnte nicht gefunden werden.";

    /**
     * 
     * @param uuid
     */
    public NotFoundException(UUID uuid)
    {
        super(String.format(ERR_NOT_FOUND, uuid.toString()));
    }
}
