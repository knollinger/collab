package org.knollinger.colab.permissions.dtos;

import java.util.UUID;

import org.knollinger.colab.permissions.models.EACLEntryType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@Builder()
public class ACLEntryDTO
{
    private UUID uuid;
    private EACLEntryType type;
    private int perms;
}
