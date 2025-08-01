package org.knollinger.colab.user.models;

import java.util.UUID;

public enum EWellknownGroupIDs
{
    GROUP_USERS(UUID.fromString("00000000-0000-0000-0000-000000000000")), //
    GROUP_ADMIN(UUID.fromString("00000000-0000-0000-0000-000000000001"));


    private UUID val;

    private EWellknownGroupIDs(UUID uuid)
    {
        this.val = uuid;
    }

    public UUID value()
    {
        return this.val;
    }
}
