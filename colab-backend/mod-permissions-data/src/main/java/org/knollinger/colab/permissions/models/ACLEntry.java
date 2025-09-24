package org.knollinger.colab.permissions.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@Builder()
public class ACLEntry
{
    private UUID uuid;
    private EACLEntryType type;
    private int perms;
}
