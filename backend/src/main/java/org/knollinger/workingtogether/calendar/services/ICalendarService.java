package org.knollinger.workingtogether.calendar.services;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.calendar.exc.NotFoundException;
import org.knollinger.workingtogether.calendar.exc.TechnicalCalendarException;
import org.knollinger.workingtogether.calendar.models.CalendarEvent;

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
     * @throws NotFoundException
     * @throws TechnicalCalendarException
     */
    CalendarEvent getEvent(UUID uuid) throws NotFoundException, TechnicalCalendarException;
}
