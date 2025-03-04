package org.knollinger.workingtogether.pinboard.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class PinBoard
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String name;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID owner;
}
