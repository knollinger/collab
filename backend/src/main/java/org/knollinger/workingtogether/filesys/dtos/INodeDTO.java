package org.knollinger.workingtogether.filesys.dtos;

import java.sql.Timestamp;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class INodeDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String name;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID parent;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID owner;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID group;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private short perms;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String type;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private long size;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Timestamp created;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Timestamp modified;
}
