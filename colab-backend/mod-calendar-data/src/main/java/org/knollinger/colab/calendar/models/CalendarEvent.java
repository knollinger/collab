package org.knollinger.colab.calendar.models;

import java.util.Date;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarEvent
{
    private UUID uuid;
    private UUID owner;
    private String title;
    private Date start;
    private Date end;
    private String desc;
    private boolean fullDay;
}
