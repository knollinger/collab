package org.knollinger.colab.calendar.dtos;

import org.knollinger.colab.calendar.models.ECalendarEventCategory;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarEventCategoryDescriptionDTO
{
    private ECalendarEventCategory category;
    private String color;
    private String desc;
}
