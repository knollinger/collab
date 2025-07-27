package org.knollinger.colab.calendar.models;

import java.util.List;

import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.user.models.User;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 */
@Builder()
@NoArgsConstructor()
@AllArgsConstructor()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarEventFull
{
    private CalendarEventCore core;
    private List<User> reqPersons;
    private List<User> optPersons;
    private List<String> hashTags;
    private List<INode> attachments;
}
