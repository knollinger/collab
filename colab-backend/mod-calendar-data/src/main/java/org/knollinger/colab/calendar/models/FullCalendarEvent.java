package org.knollinger.colab.calendar.models;

import java.util.List;

import org.knollinger.colab.filesys.models.INode;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class FullCalendarEvent
{
    private CalendarEvent event;
    List<String> hashTags;
    List<INode> attachments;
}
