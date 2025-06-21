package org.knollinger.colab.calendar.dtos;

import java.util.List;

import org.knollinger.colab.calendar.models.CalendarEvent;
import org.knollinger.colab.filesys.models.INode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class FullCalendarEventDTO
{
    private CalendarEvent event;
    private List<String> hashTags;
    private List<INode> attachments;
}
