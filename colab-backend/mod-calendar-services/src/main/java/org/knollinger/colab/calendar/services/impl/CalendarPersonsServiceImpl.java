package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.services.ICalendarPersonsService;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun.java.accessibility.util.EventID;

/**
 * 
 */
@Service
public class CalendarPersonsServiceImpl implements ICalendarPersonsService
{
    private static final String SQL_GET_ALL_PERSONS = "" //
        + "select u.uuid, u.accountName, u.email, u.surname, u.lastname, p.required" //
        + "  from users u left join calendar_persons p" //
        + "  on p.userId=u.uuid" //
        + "  where p.eventId=? and p.required=?";

    private static final String SQL_REMOVE_ALL_PERSONS = "" //
        + "delete from calendar_persons" //
        + " where eventId=?";

    private static final String SQL_GET_ADD_USER = "" //
        + "insert into calendar_persons" //
        + "  set eventId=?, userId=?, required=?";

    @Autowired
    private IDbService dbService;

    /**
     *
     */
    @Override
    public List<User> getPersons(UUID eventId, boolean req, Connection conn) throws TechnicalCalendarException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<User> result = new ArrayList<>();
            stmt = conn.prepareStatement(SQL_GET_ALL_PERSONS);
            stmt.setString(1, eventId.toString());
            stmt.setBoolean(2, req);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                User user = User.builder() //
                    .userId(UUID.fromString(rs.getString("uuid"))) //
                    .accountName(rs.getString("accountName")) //
                    .email(rs.getString("email")) //
                    .lastname(rs.getString("lastname")) //
                    .surname(rs.getString("surname")) //
                    .build();
                result.add(user);
            }
            return result;
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            throw new TechnicalCalendarException("Die Personen konnten nicht geladen werden", e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }

    /**
     * @throws TechnicalCalendarException 
     *
     */
    @Override
    public void removePersons(UUID eventId, Connection conn) throws TechnicalCalendarException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_REMOVE_ALL_PERSONS);
            stmt.setString(1, eventId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException("Die Personen für den Kalender-Termin konnten nicht gelöscht werden.",
                e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
        }
    }

    /**
     *
     */
    @Override
    public void addPersons(UUID eventId, List<User> users, boolean req, Connection conn)
        throws TechnicalCalendarException, CalEventNotFoundException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_ADD_USER);
            stmt.setString(1, eventId.toString());

            for (User user : users)
            {
                stmt.setString(2, user.getUserId().toString());
                stmt.setBoolean(3, req);
                stmt.executeUpdate();
            }
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new CalEventNotFoundException(eventId);
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException("Die Personen für den Termin konnten nicht gespeichert werden", e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
        }
    }
}
