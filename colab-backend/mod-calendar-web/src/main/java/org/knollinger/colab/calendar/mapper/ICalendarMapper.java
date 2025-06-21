package org.knollinger.colab.calendar.mapper;

import java.util.List;

import org.knollinger.colab.calendar.dtos.CalendarEventDTO;
import org.knollinger.colab.calendar.dtos.FullCalendarEventDTO;
import org.knollinger.colab.calendar.models.CalendarEvent;
import org.knollinger.colab.calendar.models.FullCalendarEvent;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface ICalendarMapper
{
    public CalendarEvent fromDTO(CalendarEventDTO dto);
    public CalendarEventDTO toDTO(CalendarEvent event);

    public List<CalendarEvent> fromDTO(List<CalendarEventDTO> dto);
    public List<CalendarEventDTO> toDTO(List<CalendarEvent> event);

    public FullCalendarEvent fromDTO(FullCalendarEventDTO dto);
    public FullCalendarEventDTO toDTO(FullCalendarEvent event);

}
