package org.knollinger.colab.calendar.models;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarEventCategoryDescription
{
    private ECalendarEventCategory category;
    private String color;
    private String desc;
}
