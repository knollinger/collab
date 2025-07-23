package org.knollinger.colab.calendar.dtos;

import org.knollinger.colab.user.dtos.UserDTO;

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
public class CalendarPersonDTO
{
    private UserDTO user;
    private boolean required;
}
