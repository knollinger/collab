package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarPerson;
import org.knollinger.colab.calendar.services.ICalendarPersonsService;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalPersonsServiceImpl implements ICalendarPersonsService
{
    private static final String SQL_GET_ALL_PERSONS = "" //
        + "select u.uuid, u.accountName, u.email, u.surname, u.lastname, p.required" //
        + "  from users u left join calendar_persons p" //
        + "  on p.userId=u.uuid" //
        + "  where p.eventId=?";

    private static final String SQL_REMOVE_PERSONS = "" //
        + "delete from calendar_persons" //
        + "  where eventId=?";

    private static final String SQL_ADD_PERSON = "" //
        + "insert into calendar_persons" //
        + " set eventId=?, userId=?, required=?";
    
    @Autowired
    private IDbService dbService;

    /**
     * @throws TechnicalCalendarException 
     *
     */
    @Override
    public List<CalendarPerson> getAllPersons(UUID eventId) throws TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<CalendarPerson> result = new ArrayList<>();
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_PERSONS);
            stmt.setString(1, eventId.toString());
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
                
                CalendarPerson person = CalendarPerson.builder() //
                    .user(user) //
                    .required(rs.getBoolean("required")) //
                    .build();
                result.add(person);
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
            this.dbService.closeQuitely(conn);
        }
    }

    @Override
    public void savePersons(UUID eventId, List<CalendarPerson> persons) throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbService.openConnection();
            conn.setAutoCommit(false);

            this.removePersons(eventId, conn);
            
            stmt = conn.prepareStatement(SQL_ADD_PERSON);
            for (CalendarPerson person : persons)
            {
                stmt.setString(1, eventId.toString());
                stmt.setString(2, person.getUser().getUserId().toString());
                stmt.setBoolean(3, person.isRequired());
                stmt.executeUpdate();
            }

            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException("Die Personen für den Termin konnten nicht gespeichert werden.", e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * Lösche alle Personen-Zuordnungen vom event deren required-State zu dem angegebenen State passt
     * 
     * @param eventId
     * @param required
     * @param conn
     * @throws SQLException 
     */
    private void removePersons(UUID eventId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_REMOVE_PERSONS);
            stmt.setString(1, eventId.toString());
            stmt.executeUpdate();
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
        }
    }
}
