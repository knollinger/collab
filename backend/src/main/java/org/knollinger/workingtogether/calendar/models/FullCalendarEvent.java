package org.knollinger.workingtogether.calendar.models;

import java.util.List;

import org.knollinger.workingtogether.filesys.models.INode;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class FullCalendarEvent
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
