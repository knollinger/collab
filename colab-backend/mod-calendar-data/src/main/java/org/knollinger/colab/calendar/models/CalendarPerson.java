package org.knollinger.colab.calendar.models;

import org.knollinger.colab.user.models.User;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder()
@AllArgsConstructor()
@NoArgsConstructor()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarPerson 
{
    private User user;
    private boolean required;
}
