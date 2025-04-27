package org.knollinger.workingtogether.calendar.models;

import java.util.Date;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class CalendarEvent
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID owner;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String title;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Date start;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Date end;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String desc;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private boolean fullDay;
}
