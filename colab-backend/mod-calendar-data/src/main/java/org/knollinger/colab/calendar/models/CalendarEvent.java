package org.knollinger.colab.calendar.models;

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
    private long start; // wird als "millies sice epoch" transportiert, UTC ist gemeint
    private long end; // wird als "millies sice epoch" transportiert, UTC ist gemeint
    private String desc;
    private boolean fullDay;
    private String rruleset;

    /**
     * @return
     */
    public boolean isRecurring()
    {
        return this.rruleset != null && !this.rruleset.isBlank();
    }
}
