package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.NotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEvent;
import org.knollinger.colab.calendar.services.ICalendarService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class CalendarServiceImpl implements ICalendarService
{
    private static final String ERR_LOAD_ALL_EVENTS = "Die Liste aller Kalender-Einträge konnte nicht geladen werden.";
    private static final String ERR_GET_EVENT = "Der Kalender-Eintrage konnte nicht geladen werden.";

    //
    // Ein SingleEvent hat schon mal keine RecurrenceRule.
    //
    // Außerdem liegt entweder der start ODER das ende innerhalb des such-Intervalls oder
    // der Start liegt vor dem Ende des Such-Intervalls UND das Ende liegt nach dem Start
    // des Such-Intervalls
    //
    // Das SQL ist ziemlich scheiße, jeder MYSQL/MARIADB-Guru ist herzlich eingeladen das 
    // zu optimieren. :-)
    //
    private static final String SQL_GET_SINGLE_EVENTS = "" //
        + "select `uuid`, `owner`, `start`, `duration`, `title`, `desc`, `fullDay`" //
        + " from calendar" //
        + "  where " //
        + "    rruleset is null and" //
        + "    (" //
        + "        (start between ? and ?) or (end between ? and ?) or" //
        + "        (start <= ? and end >= ?)" //
        + "    )";

    private static final String SQL_GET_EVENT = "" //
        + "select `uuid`, `owner`, `start`, `duration`, `title`, `desc`, `fullDay`, `rruleset` from calendar" //
        + "  where uuid=?";


    @Autowired()
    private IDbService dbSvc;

    /**
     * Liefere alle Events innerhalb des angegebenen Zeitraums
     */
    @Override
    public List<CalendarEvent> getAllEvents(Date startDate, Date endDate) throws TechnicalCalendarException
    {
        Connection conn = null;

        try
        {
            List<CalendarEvent> result = new ArrayList<>();
            
            Timestamp start = new Timestamp(startDate.getTime());
            Timestamp end = new Timestamp(endDate.getTime());

            conn = this.dbSvc.openConnection();
            result.addAll(this.getSingleEvents(start, end, conn));
            result.addAll(this.getRecurringEvents(start, end, conn));
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException(ERR_LOAD_ALL_EVENTS, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * Liefere alle Events, welche nicht recurring sind und in den angegebenen Zeitraum passen.
     * 
     * @param startDate
     * @param endDate
     * @param conn
     * @return
     * @throws SQLException
     */
    private List<CalendarEvent> getSingleEvents(Timestamp start, Timestamp end, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<CalendarEvent> result = new ArrayList<>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_SINGLE_EVENTS);
            stmt.setTimestamp(1, start);
            stmt.setTimestamp(2, end);
            stmt.setTimestamp(3, start);
            stmt.setTimestamp(4, end);
            stmt.setTimestamp(5, end);
            stmt.setTimestamp(6, start);

            rs = stmt.executeQuery();
            while (rs.next())
            {
                CalendarEvent evt = CalendarEvent.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .start(rs.getTimestamp("start").getTime()) //
                    .duration(rs.getLong("duration") * 1000) // dauer wird in Sekunden gespeichert, Millies draus machen
                    .title(rs.getString("title")) //
                    .desc(rs.getString("desc")) //
                    .fullDay(rs.getBoolean("fullDay")) //
                    .build();
                result.add(evt);
            }

            return result;
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * Liefere alle RecurringEvent-Instanzen welche in den Such-Bereich fallen
     * 
     * @param start
     * @param end
     * @param conn
     * @return
     */
    private Collection<CalendarEvent> getRecurringEvents(Timestamp start, Timestamp end, Connection conn)
    {
        return Collections.emptyList();
    }

    /**
     * liefere ein einzelnes Events
     */
    @Override
    public CalendarEvent getEvent(UUID uuid) throws NotFoundException, TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_EVENT);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new NotFoundException(uuid);
            }

            return CalendarEvent.builder() //
                .uuid(UUID.fromString(rs.getString("uuid"))) //
                .owner(UUID.fromString(rs.getString("owner"))) //
                .start(rs.getTimestamp("start").getTime()) //
                .duration(rs.getLong("duration") * 1000)// Aus der gespeicherten Sekunden Millies machen
                .title(rs.getString("title")) //
                .desc(rs.getString("desc")) //
                .fullDay(rs.getBoolean("fullDay")) //
                .rruleset(rs.getString("rruleset")) //
                .build();
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException(ERR_GET_EVENT, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }
}
