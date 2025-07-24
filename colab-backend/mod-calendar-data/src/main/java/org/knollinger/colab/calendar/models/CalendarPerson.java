package org.knollinger.colab.calendar.models;

import org.knollinger.colab.user.models.User;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarPerson 
{
    private User user;
    private boolean required;
}
