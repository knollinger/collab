package org.knollinger.colab.calendar.mapper;

import java.util.List;

import org.knollinger.colab.calendar.dtos.CalendarPersonDTO;
import org.knollinger.colab.calendar.models.CalendarPerson;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface ICalPersonMapper
{
    public CalendarPerson fromDTO(CalendarPersonDTO dto);
    public CalendarPersonDTO toDTO(CalendarPerson person);

    public List<CalendarPerson> fromDTO(List<CalendarPersonDTO> dto);
    public List<CalendarPersonDTO> toDTO(List<CalendarPerson> person);
}
