package org.knollinger.colab.calendar.mapper;

import java.util.List;

import org.knollinger.colab.calendar.dtos.CalendarEventCategoryDescriptionDTO;
import org.knollinger.colab.calendar.dtos.CalendarEventCoreDTO;
import org.knollinger.colab.calendar.dtos.CalendarEventFullDTO;
import org.knollinger.colab.calendar.models.CalendarEventCategoryDescription;
import org.knollinger.colab.calendar.models.CalendarEventCore;
import org.knollinger.colab.calendar.models.CalendarEventFull;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ICalendarMapper
{
    public CalendarEventCategoryDescription categoryFromDTO(CalendarEventCategoryDescriptionDTO dto);
    public CalendarEventCategoryDescriptionDTO categoryToDTO(CalendarEventCategoryDescription event);

    public List<CalendarEventCategoryDescription> categoryFromDTO(List<CalendarEventCategoryDescriptionDTO> dto);
    public List<CalendarEventCategoryDescriptionDTO> categoryToDTO(List<CalendarEventCategoryDescription> event);

    public CalendarEventCore coreFromDTO(CalendarEventCoreDTO dto);
    public CalendarEventCoreDTO coreToDTO(CalendarEventCore event);

    public List<CalendarEventCore> coreFromDTO(List<CalendarEventCoreDTO> dto);
    public List<CalendarEventCoreDTO> coreToDTO(List<CalendarEventCore> event);

    public CalendarEventFull fullFromDTO(CalendarEventFullDTO dto);
    public CalendarEventFullDTO fullToDTO(CalendarEventFull event);

    public List<CalendarEventFull> fullFromDTO(List<CalendarEventFullDTO> dto);
    public List<CalendarEventFullDTO> fullToDTO(List<CalendarEventFull> event);
}
