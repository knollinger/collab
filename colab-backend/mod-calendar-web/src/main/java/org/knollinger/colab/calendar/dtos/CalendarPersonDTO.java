package org.knollinger.colab.calendar.dtos;

import org.knollinger.colab.user.dtos.UserDTO;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarPersonDTO
{
    private UserDTO user;
    private boolean required;
}
