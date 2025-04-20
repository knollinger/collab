package org.knollinger.workingtogether.calendar.services;

import java.sql.Timestamp;
import java.util.List;

import org.knollinger.workingtogether.calendar.TechnicalCalendarException;
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
    List<CalendarEvent> getAllEvents(Timestamp start, Timestamp end) throws TechnicalCalendarException;
}
