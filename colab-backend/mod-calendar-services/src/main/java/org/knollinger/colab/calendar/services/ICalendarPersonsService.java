package org.knollinger.colab.calendar.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.user.models.User;

/**
 * Der Service zur verwaltung der Personen an einem CalendarEvent. Alle Methoden
 * sollen innerhalb einer Transaktion laufen, deswegen werden den Methoden immer
 * die Connection-Objekte übergeben.
 * 
 */
public interface ICalendarPersonsService
{
    /**
     * Liefere alle Personen zu einem Event
     * 
     * @param eventId
     * @param conn
     * @return
     * @throws TechnicalCalendarException
     */
    public List<User> getPersons(UUID eventId, boolean req, Connection conn) throws TechnicalCalendarException;

    /**
     * @param ebentId
     * @param users
     * @param req
     * @param conn
     * @throws TechnicalCalendarException
     * @throws CalEventNotFoundException
     */
    public void addPersons(UUID ebentId, List<User> users, boolean req, Connection conn) throws TechnicalCalendarException, CalEventNotFoundException;
    
    /**
     * @param eventId
     * @param conn
     * @throws TechnicalCalendarException 
     */
    public void removePersons(UUID eventId, Connection conn) throws TechnicalCalendarException;
}
