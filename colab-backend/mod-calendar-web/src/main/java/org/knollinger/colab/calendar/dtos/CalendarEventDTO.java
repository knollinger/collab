package org.knollinger.colab.calendar.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class CalendarEventDTO
{
    private UUID uuid;
    private UUID owner;
    private String title;
    private long start;
    private long duration;
    private String desc;
    private boolean fullDay;
    private String rruleset;
}
