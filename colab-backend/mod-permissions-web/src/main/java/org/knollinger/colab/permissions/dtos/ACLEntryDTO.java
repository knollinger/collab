package org.knollinger.colab.permissions.dtos;

import java.util.UUID;

import org.knollinger.colab.permissions.models.EACLEntryType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@Builder()
@NoArgsConstructor()
@AllArgsConstructor()
public class ACLEntryDTO
{
    private UUID uuid;
    private EACLEntryType type;
    private int perms;
}
