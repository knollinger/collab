package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.NotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEvent;
import org.knollinger.colab.calendar.services.ICalendarService;
import org.knollinger.colab.user.models.User;
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

    private static final String SQL_GET_ALL_EVENTS = "" //
        + "select `uuid`, `owner`, `start`, `end`, `title`, `desc`, `fullDay` from calendar" //
        + "  where " //
        + "    ((start between ? and ?) or (end between ? and ?)) and" //
        + "    owner=?";

    private static final String SQL_GET_EVENT = "" //
        + "select `uuid`, `owner`, `start`, `end`, `title`, `desc`, `fullDay` from calendar" //
        + "  where uuid=?";


    @Autowired()
    private IDbService dbSvc;

    @Autowired
    private ICurrentUserService currUserSvc;

    /**
     *
     */
    @Override
    public List<CalendarEvent> getAllEvents(Date start, Date end) throws TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<CalendarEvent> result = new ArrayList<>();

            User user = this.currUserSvc.get().getUser();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_EVENTS);
            stmt.setTimestamp(1, new Timestamp(start.getTime()));
            stmt.setTimestamp(2, new Timestamp(end.getTime()));
            stmt.setTimestamp(3, new Timestamp(start.getTime()));
            stmt.setTimestamp(4, new Timestamp(end.getTime()));
            stmt.setString(5, user.getUserId().toString());

            rs = stmt.executeQuery();
            while (rs.next())
            {
                CalendarEvent evt = CalendarEvent.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .start(new Date(rs.getTimestamp("start").getTime())) //
                    .end(new Date(rs.getTimestamp("end").getTime()))//
                    .title(rs.getString("title")) //
                    .desc(rs.getString("desc")) //
                    .fullDay(rs.getBoolean("fullDay")) //
                    .build();
                result.add(evt);
            }

            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException(ERR_LOAD_ALL_EVENTS, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
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
                .start(new Date(rs.getTimestamp("start").getTime())) //
                .end(new Date(rs.getTimestamp("end").getTime()))//
                .title(rs.getString("title")) //
                .desc(rs.getString("desc")) //
                .fullDay(rs.getBoolean("fullDay")) //
                .build();
        }
        catch (SQLException e)
        {
            e.printStackTrace();
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
