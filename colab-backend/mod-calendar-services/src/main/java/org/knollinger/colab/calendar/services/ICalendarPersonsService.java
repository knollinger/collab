package org.knollinger.colab.calendar.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarPerson;

public interface ICalendarPersonsService
{
    /**
     * Liefere alle Personen zu einem Event
     * 
     * @param eventId
     * @param required
     * @return
     * @throws TechnicalCalendarException
     */
    public List<CalendarPerson> getAllPersons(UUID eventId) throws TechnicalCalendarException;
    
    /**
     * 
     * @param eventId
     * @param user
     * @param required
     * @throws TechnicalCalendarException
     */
    void savePersons(UUID eventId, List<CalendarPerson> user) throws CalEventNotFoundException, TechnicalCalendarException;
}
