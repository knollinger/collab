package org.knollinger.workingtogether.user.models;

import java.util.UUID;

public enum EWellknownUserIDs
{
    ROOT(UUID.fromString("00000000-0000-0000-0000-100000000000"));

    private UUID val;

    private EWellknownUserIDs(UUID uuid)
    {
        this.val = uuid;
    }

    public UUID value()
    {
        return this.val;
    }
}
