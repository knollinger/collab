package org.knollinger.colab.calendar.dtos;

import java.util.List;

import org.knollinger.colab.calendar.models.CalendarEvent;
import org.knollinger.colab.filesys.models.INode;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class FullCalendarEventDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private CalendarEvent event;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<String> hashTags;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<INode> attachments;
}
