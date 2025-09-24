package org.knollinger.colab.filesys.dtos;

import java.sql.Timestamp;
import java.util.UUID;

import org.knollinger.colab.permissions.dtos.ACLDTO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class INodeDTO
{
    private String name;
    private UUID uuid;
    private UUID parent;
    private UUID linkTo;
    private UUID owner;
    private UUID group;
    private String type;
    private long size;
    private Timestamp created;
    private Timestamp modified;
    private int perms;
    private int effectivePerms;
    private ACLDTO acl;
}
