package org.knollinger.colab.calendar.services.impl;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEvent;
import org.knollinger.colab.calendar.services.ICalendarService;
import org.knollinger.colab.user.services.ICurrentUserService;
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

    private static final String SQL_GET_EVENT = "" //
        + "select `uuid`, `owner`, `start`, `end`, `title`, `desc`, `fullDay`, `rruleset`" //
        + " from calendar" //
        + "  where uuid=?"; // TODO: Owner?

    private static final String SQL_GET_ALL_EVENTS = "" //
        + "select `uuid`, `owner`, `start`, `end`, `title`, `desc`, `fullDay`, `rruleset`" //
        + " from calendar" //
        + "  where start <= ? and last_occurence >=?";

    private static final String SQL_CREATE_EVENT = "" //
        + "insert into calendar " //
        + "  set`uuid`=?, `owner`=?, `start`=?, `end`=?, `title`=?, `desc`=?, `fullDay`=?, `rruleset`=?, `last_occurence`=?";

    private static final String SQL_UPDATE_EVENT = "" //
        + "update calendar " //
        + "  set `start`=?, `end`=?, `title`=?, `desc`=?, `fullDay`=?, `rruleset`=?, `last_occurence`=?" //
        + "  where `uuid`=?";


    @Autowired()
    private IDbService dbSvc;

    @Autowired
    private ICurrentUserService currUserSvc;

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
            result.addAll(this.getAllEvents(start, end, conn));
            return result;
        }
        catch (SQLException | IOException | InvalidRecurrenceRuleException | ParseException e)
        {
            e.printStackTrace();
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
     * @throws InvalidRecurrenceRuleException 
     * @throws ParseException 
     */
    private List<CalendarEvent> getAllEvents(Timestamp start, Timestamp end, Connection conn)
        throws SQLException, IOException, InvalidRecurrenceRuleException, ParseException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<CalendarEvent> result = new ArrayList<>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_EVENTS);
            stmt.setTimestamp(1, end);
            stmt.setTimestamp(2, start);

            rs = stmt.executeQuery();
            while (rs.next())
            {
                CalendarEvent evt = CalendarEvent.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .start(rs.getTimestamp("start").getTime()) //
                    .end(rs.getTimestamp("end").getTime()) // 
                    .title(rs.getString("title")) //
                    .desc(rs.getString("desc")) //
                    .fullDay(rs.getBoolean("fullDay")) //
                    .rruleset(rs.getString("rruleset")) //
                    .build();

                if (evt.getRruleset() == null)
                {
                    result.add(evt);
                }
                else
                {
                    RecurringRuleParser parser = new RecurringRuleParser();
                    result.addAll(parser.eventsBetween(evt, start, end));
                }
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
     * liefere ein einzelnes Events
     */
    @Override
    public CalendarEvent getEvent(UUID uuid) throws CalEventNotFoundException, TechnicalCalendarException
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
                throw new CalEventNotFoundException(uuid);
            }

            return CalendarEvent.builder() //
                .uuid(UUID.fromString(rs.getString("uuid"))) //
                .owner(UUID.fromString(rs.getString("owner"))) //
                .start(rs.getTimestamp("start").getTime()) //
                .end(rs.getTimestamp("end").getTime()).title(rs.getString("title")) //
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

    @Override
    public CalendarEvent createEvent(CalendarEvent evt) throws TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            String ruleSet = null;
            Timestamp lastOccurence = null;
            if (evt.isRecurring())
            {
                RecurringRuleParser parser = new RecurringRuleParser();
                lastOccurence = new Timestamp(parser.lastEvent(evt).getTime());
                ruleSet = evt.getRruleset();
            }
            else
            {
                lastOccurence = new Timestamp(evt.getEnd());
            }

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_CREATE_EVENT);

            UUID uuid = UUID.randomUUID();
            UUID owner = this.currUserSvc.get().getUser().getUserId();

            stmt.setString(1, uuid.toString());
            stmt.setString(2, owner.toString());
            stmt.setTimestamp(3, new Timestamp(evt.getStart()));
            stmt.setTimestamp(4, new Timestamp(evt.getEnd()));
            stmt.setString(5, evt.getTitle());
            stmt.setString(6, evt.getDesc());
            stmt.setBoolean(7, evt.isFullDay());
            stmt.setString(8, ruleSet);
            stmt.setTimestamp(9, lastOccurence);

            stmt.executeUpdate();

            return CalendarEvent.builder() //
                .uuid(uuid) //
                .owner(owner) //
                .title(evt.getTitle()) //
                .desc(evt.getDesc()) //
                .start(evt.getStart()) //
                .end(evt.getEnd()) //
                .fullDay(evt.isFullDay()) //
                .rruleset(evt.getRruleset()) //
                .build();
        }
        catch (Exception e)
        {
            throw new TechnicalCalendarException("Das Kalender-Event konnte nicht erzeugt werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public CalendarEvent updateEvent(CalendarEvent evt) throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            String ruleSet = null;
            Timestamp lastOccurence = null;
            if (evt.isRecurring())
            {
                RecurringRuleParser parser = new RecurringRuleParser();
                lastOccurence = new Timestamp(parser.lastEvent(evt).getTime());
                ruleSet = evt.getRruleset();
            }
            else
            {
                lastOccurence = new Timestamp(evt.getEnd());
            }

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_UPDATE_EVENT);

            stmt.setTimestamp(1, new Timestamp(evt.getStart()));
            stmt.setTimestamp(2, new Timestamp(evt.getEnd()));
            stmt.setString(3, evt.getTitle());
            stmt.setString(4, evt.getDesc());
            stmt.setBoolean(5, evt.isFullDay());
            stmt.setString(6, ruleSet);
            stmt.setTimestamp(7, lastOccurence);
            stmt.setString(8, evt.getUuid().toString());
            if (stmt.executeUpdate() != 1)
            {
                throw new CalEventNotFoundException(evt.getUuid());
            }
            return evt;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw new TechnicalCalendarException("Das Kalender-Event konnte nicht aktualisiert werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }
}
