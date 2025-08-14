package org.knollinger.colab.calendar.dtos;

import java.util.UUID;

import org.knollinger.colab.calendar.models.ECalendarEventCategory;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class CalendarEventCoreDTO
{
    private UUID uuid;
    private UUID owner;
    private String title;
    private long start;
    private long end;
    private String desc;
    ECalendarEventCategory category;
    private boolean fullDay;
    private String rruleset;
    private String osmLocId;
}
