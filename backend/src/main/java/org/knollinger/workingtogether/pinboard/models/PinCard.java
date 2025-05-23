package org.knollinger.workingtogether.pinboard.models;

import java.sql.Timestamp;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class PinCard
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID boardId;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String title;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID owner;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Timestamp created;
}
