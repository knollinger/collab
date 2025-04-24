package org.knollinger.workingtogether.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.calendar.TechnicalCalendarException;
import org.knollinger.workingtogether.calendar.models.CalendarEvent;
import org.knollinger.workingtogether.calendar.services.ICalendarService;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.ICurrentUserService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class CalendarServiceImpl implements ICalendarService
{
    private static final String ERR_LOAD_ALL_EVENTS = "Die Liste aller Kalender-EInträge konnte nicht geladen werden.";

    private static final String SQL_GET_ALL_EVENTS = "" //
        + "select uuid, owner, start, end, text from calendar" //
        + "  where " //
        + "    ((start between ? and ?) or (end between ? and ?)) and" //
        + "    owner=?";

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
                    .end(new Date(rs.getTimestamp("end").getTime()))
                    .text(rs.getString("text")) //
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
}
