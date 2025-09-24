package org.knollinger.colab.permissions.dtos;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@Builder()
public class ACLDTO
{
    private UUID ownerId;
    private UUID groupId;
    private List<ACLEntryDTO> entries;
}
