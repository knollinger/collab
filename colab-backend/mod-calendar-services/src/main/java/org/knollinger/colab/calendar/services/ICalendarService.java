package org.knollinger.colab.calendar.services;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEvent;

/**
 * Die Schnittstelle zu den Calendar-Services
 */
public interface ICalendarService
{
    /**
     * Liefere alle Events im angegebenen Zeitraum (inclusive)
     * 
     * @param start
     * @param end
     * @return niemals <code>null</code>, ggf. eine leere Liste
     * @throws TechnicalCalendarException 
     */
    List<CalendarEvent> getAllEvents(Date start, Date end) throws TechnicalCalendarException;

    /**
     * @param uuid
     * @return
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    CalendarEvent getEvent(UUID uuid) throws CalEventNotFoundException, TechnicalCalendarException;

    CalendarEvent createEvent(CalendarEvent evt)  throws TechnicalCalendarException;

    CalendarEvent updateEvent(CalendarEvent fromDTO) throws CalEventNotFoundException, TechnicalCalendarException;
}
