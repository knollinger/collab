package org.knollinger.workingtogether.calendar.mapper;

import java.util.List;

import org.knollinger.workingtogether.calendar.dtos.CalendarEventDTO;
import org.knollinger.workingtogether.calendar.models.CalendarEvent;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface ICalendarMapper
{
    public CalendarEvent fromDTO(CalendarEventDTO dto);
    public CalendarEventDTO toDTO(CalendarEvent event);

    public List<CalendarEvent> fromDTO(List<CalendarEventDTO> dto);
    public List<CalendarEventDTO> toDTO(List<CalendarEvent> event);
}
