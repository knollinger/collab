package org.knollinger.colab.calendar.services;

import java.util.List;

import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEventCategoryDescription;

public interface ICalendarCategoriesService
{
    public List<CalendarEventCategoryDescription> getAllCategories() throws TechnicalCalendarException;
}
