package org.knollinger.workingtogether.filesys.models;

import java.util.UUID;

public enum EWellknownINodeIDs
{
    NONE(UUID.fromString("ffffffff-ffff-ffff-ffff-ffffffffffff")),
    ROOT(UUID.fromString("00000000-0000-0000-0000-000000000000"));

    private UUID uuid;
    private EWellknownINodeIDs(UUID uuid)
    {
        this.uuid = uuid;
    }

    public UUID value()
    {
        return this.uuid;
    }
}
