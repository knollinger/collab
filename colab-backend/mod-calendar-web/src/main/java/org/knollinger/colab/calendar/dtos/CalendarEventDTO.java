package org.knollinger.colab.calendar.dtos;

import java.util.Date;
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
    private Date start;
    private Date end;
    private String desc;
    private boolean fullDay;
}
