package org.knollinger.colab.calendar.services;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEventCore;
import org.knollinger.colab.calendar.models.CalendarEventFull;

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
    List<CalendarEventCore> getAllEventCores(Date start, Date end) throws TechnicalCalendarException;

    /**
     * @param uuid
     * @return
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    CalendarEventFull getFullEvent(UUID uuid) throws CalEventNotFoundException, TechnicalCalendarException;

    /**
     * Erzeuge ein neues Event
     * 
     * @param evt
     * @return
     * @throws TechnicalCalendarException
     */
    CalendarEventFull createFullEvent(CalendarEventFull evt) throws TechnicalCalendarException;

    /**
     * Aktualisiere das CalendarEvent. Dazu gehört das CoreEvent 
     * (incl RecurrenceRuleSet), Hashtags, Attachments und Personen.
     * 
     * @param fromDTO
     * @return
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    CalendarEventFull updateFullEvent(CalendarEventFull fromDTO)
        throws CalEventNotFoundException, TechnicalCalendarException;

    /**
     * In einigen Situation reicht es aus, das CoreEvent zu aktualisieren,
     * zum Beispiel beim DnD-Move bzw Resize des Events.
     * 
     * @param coreFromDTO
     * @return
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    CalendarEventCore updateEventCore(CalendarEventCore coreFromDTO)
        throws CalEventNotFoundException, TechnicalCalendarException;

    /**
     * Lösche ein Event komplett. Es werden alle Attachments, HashTags, Personen
     * und das CoreEvent gelöscht.
     * 
     * @param eventId
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    public void deleteEvent(UUID eventId) throws CalEventNotFoundException, TechnicalCalendarException;
}
