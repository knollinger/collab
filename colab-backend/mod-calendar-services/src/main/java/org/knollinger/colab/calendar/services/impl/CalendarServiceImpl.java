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
import org.knollinger.colab.calendar.models.CalendarEventCore;
import org.knollinger.colab.calendar.models.CalendarEventFull;
import org.knollinger.colab.calendar.models.ECalendarEventCategory;
import org.knollinger.colab.calendar.services.ICalendarAttachmentsService;
import org.knollinger.colab.calendar.services.ICalendarPersonsService;
import org.knollinger.colab.calendar.services.ICalendarService;
import org.knollinger.colab.hashtags.exceptions.TechnicalHashTagException;
import org.knollinger.colab.hashtags.models.EHashTagType;
import org.knollinger.colab.hashtags.services.IHashTagService;
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
    private static final String ERR_DELETE_EVENT = "Das Event konnte nicht gelöscht werden.";

    private static final String SQL_GET_ALL_EVENTS = "" //
          + "select `c`.`uuid`, `c`.`owner`, `c`.`start`, `c`.`end`, `c`.`title`, `c`.`desc`, `c`.`category`, `c`.`fullDay`, `c`.`rruleset`, `c`.`osmLocId`" //
          + "  from calendar c" //
          + "  left join calendar_persons p" //
          + "  on c.uuid=p.eventId" //
          + "  where c.start <= ? and c.last_occurence >=? AND p.userId=?";
        
    private static final String SQL_GET_EVENT_CORE = "" //
        + "select `uuid`, `owner`, `start`, `end`, `title`, `desc`, `category`, `fullDay`, `rruleset`, `osmLocId`" //
        + " from calendar" //
        + "  where `uuid`=?";

    private static final String SQL_CREATE_EVENT_CORE = "" //
        + "insert into calendar " //
        + "  set `uuid`=?, `owner`=?, `start`=?, `end`=?, `title`=?, `desc`=?, `category`=?, `fullDay`=?, `rruleset`=?, `last_occurence`=?, `osmLocId`=?";

    private static final String SQL_UPDATE_EVENT_CORE = "" //
        + "update calendar " //
        + "  set `start`=?, `end`=?, `title`=?, `desc`=?, `category`=?, `fullDay`=?, `rruleset`=?, `last_occurence`=?, `osmLocId`=?" //
        + "  where `uuid`=?";

    private static final String SQL_DELETE_EVENT_CORE = "" //
        + "delete from calendar" //
        + "  where uuid=?";

    @Autowired
    private IDbService dbSvc;

    @Autowired
    private IHashTagService hashTagSvc;

    @Autowired
    private ICalendarAttachmentsService attachmentsSvc;

    @Autowired
    private ICalendarPersonsService personSvc;

    @Autowired
    private ICurrentUserService currUserSvc;

    /**
     *
     */
    @Override
    public List<CalendarEventCore> getAllEventCores(Date startDate, Date endDate) throws TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<CalendarEventCore> result = new ArrayList<>();
            Timestamp start = new Timestamp(startDate.getTime());
            Timestamp end = new Timestamp(endDate.getTime());

            conn = this.dbSvc.openConnection();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_EVENTS);
            stmt.setTimestamp(1, end);
            stmt.setTimestamp(2, start);
            stmt.setString(3, this.currUserSvc.getUser().getUserId().toString());

            System.err.println(stmt);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                CalendarEventCore evt = this.eventCoreFromResultSet(rs);
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
        catch (SQLException | IOException | InvalidRecurrenceRuleException | ParseException e)
        {
            e.printStackTrace();
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
    public CalendarEventFull getFullEvent(UUID uuid) throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;
        try
        {
            conn = this.dbSvc.openConnection();
            CalendarEventCore core = this.loadEventCore(uuid, conn);
            if (core == null)
            {
                throw new CalEventNotFoundException(uuid);
            }

            return CalendarEventFull.builder() //
                .core(core) //
                .reqPersons(this.personSvc.getPersons(uuid, true, conn)) //
                .optPersons(this.personSvc.getPersons(uuid, false, conn)) //
                .hashTags(this.hashTagSvc.getHashTagsByResource(uuid, conn)) //
                .attachments(this.attachmentsSvc.getAttachments(uuid, conn)) //
                .build();
        }
        catch (SQLException | TechnicalHashTagException e)
        {
            e.printStackTrace();
            throw new TechnicalCalendarException("???", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public CalendarEventFull createFullEvent(CalendarEventFull evt) throws TechnicalCalendarException
    {
        Connection conn = null;
        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);
            
            CalendarEventCore core = this.createEventCore(evt.getCore(), conn);
            this.hashTagSvc.saveHashTags(core.getUuid(), evt.getHashTags(), EHashTagType.CALENDAR, conn);
            this.attachmentsSvc.saveAttachments(core.getUuid(), evt.getAttachments(), conn);
            this.personSvc.removePersons(core.getUuid(), conn);
            this.personSvc.addPersons(core.getUuid(), evt.getReqPersons(), true, conn);
            this.personSvc.addPersons(core.getUuid(), evt.getOptPersons(), false, conn);
            
            conn.commit();
            
            return CalendarEventFull.builder() //
                .core(core) //
                .reqPersons(evt.getReqPersons()) //
                .optPersons(evt.getOptPersons()) //
                .hashTags(evt.getHashTags()) //
                .attachments(evt.getAttachments()) //
                .build();
        }
        catch (Exception e)
        {
            throw new TechnicalCalendarException("Der Kalender-Termin konnte nicht erzeugt werden", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public CalendarEventFull updateFullEvent(CalendarEventFull evt)
        throws CalEventNotFoundException, TechnicalCalendarException
    {
        UUID eventId = evt.getCore().getUuid();
        Connection conn = null;
        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);
            
            this.updateEventCore(evt.getCore(), conn);
            this.hashTagSvc.saveHashTags(eventId, evt.getHashTags(), EHashTagType.CALENDAR, conn);
            this.attachmentsSvc.saveAttachments(eventId, evt.getAttachments(), conn);
            this.personSvc.removePersons(eventId, conn);
            this.personSvc.addPersons(eventId, evt.getReqPersons(), true, conn);
            this.personSvc.addPersons(eventId, evt.getOptPersons(), false, conn);
            
            conn.commit();
        }
        catch (SQLException | TechnicalHashTagException e)
        {
            throw new TechnicalCalendarException("Der Kalender-Termin konnte nicht aktualisiert werden", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
        return evt;
    }

    /**
    *
    */
    @Override
    public CalendarEventCore updateEventCore(CalendarEventCore evt)
        throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            return this.updateEventCore(evt, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalCalendarException("Das Kalender-Event konnte nicht aktualisiert werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    private CalendarEventCore createEventCore(CalendarEventCore evt, Connection conn) throws TechnicalCalendarException
    {
        PreparedStatement stmt = null;
        try
        {
            UUID uuid = UUID.randomUUID();
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

            stmt = conn.prepareStatement(SQL_CREATE_EVENT_CORE);

            stmt.setString(1, uuid.toString());
            stmt.setString(2, this.currUserSvc.getUser().getUserId().toString());
            stmt.setTimestamp(3, new Timestamp(evt.getStart()));
            stmt.setTimestamp(4, new Timestamp(evt.getEnd()));
            stmt.setString(5, evt.getTitle());
            stmt.setString(6, evt.getDesc());
            stmt.setString(7, evt.getCategory().name());
            stmt.setBoolean(8, evt.isFullDay());
            stmt.setString(9, ruleSet);
            stmt.setTimestamp(10, lastOccurence);
            stmt.setString(11, evt.getOsmLocId());
            stmt.executeUpdate();
            
            return CalendarEventCore.builder() //
                .uuid(uuid) //
                .owner(evt.getOwner()) //
                .start(evt.getStart()) //
                .end(evt.getEnd()) // 
                .title(evt.getTitle()) //
                .desc(evt.getDesc()) //
                .fullDay(evt.isFullDay()) //
                .rruleset(evt.getRruleset()) //
                .build();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw new TechnicalCalendarException("Das Kalender-Event konnte nicht erzeugt werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * @param evt
     * @param conn
     * @return
     * @throws TechnicalCalendarException
     */
    private CalendarEventCore updateEventCore(CalendarEventCore evt, Connection conn) throws TechnicalCalendarException
    {
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

            stmt = conn.prepareStatement(SQL_UPDATE_EVENT_CORE);

            stmt.setTimestamp(1, new Timestamp(evt.getStart()));
            stmt.setTimestamp(2, new Timestamp(evt.getEnd()));
            stmt.setString(3, evt.getTitle());
            stmt.setString(4, evt.getDesc());
            stmt.setString(5, evt.getCategory().name());
            stmt.setBoolean(6, evt.isFullDay());
            stmt.setString(7, ruleSet);
            stmt.setTimestamp(8, lastOccurence);
            stmt.setString(9, evt.getOsmLocId());
            stmt.setString(10, evt.getUuid().toString());
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
        }
    }

    /**
     *
     */
    @Override
    public void deleteEvent(UUID eventId) throws CalEventNotFoundException, TechnicalCalendarException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            this.attachmentsSvc.removeAttachments(eventId, conn);
            this.hashTagSvc.removeHashTagsByRefId(eventId, conn);
            this.personSvc.removePersons(eventId, conn);
            this.deleteEvent(eventId, conn);

            conn.commit();
        }
        catch (SQLException | TechnicalHashTagException e)
        {
            throw new TechnicalCalendarException(ERR_DELETE_EVENT, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param eventId
     * @param conn
     * @throws SQLException 
     */
    private void deleteEvent(UUID eventId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_DELETE_EVENT_CORE);
            stmt.setString(1, eventId.toString());
            stmt.executeUpdate();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * @param eventId
     * @param conn
     * @return
     * @throws SQLException
     */
    private CalendarEventCore loadEventCore(UUID eventId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_EVENT_CORE);
            stmt.setString(1, eventId.toString());
            rs = stmt.executeQuery();
            return rs.next() ? this.eventCoreFromResultSet(rs) : null;
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * Lade einen EventCore aus einem ResultSet
     * 
     * @param rs
     * @return
     * @throws SQLException
     */
    private CalendarEventCore eventCoreFromResultSet(ResultSet rs) throws SQLException
    {
        return CalendarEventCore.builder() //
            .uuid(UUID.fromString(rs.getString("uuid"))) //
            .owner(UUID.fromString(rs.getString("owner"))) //
            .start(rs.getTimestamp("start").getTime()) //
            .end(rs.getTimestamp("end").getTime()) // 
            .title(rs.getString("title")) //
            .desc(rs.getString("desc")) //
            .category(ECalendarEventCategory.valueOf(rs.getString("category"))) //
            .fullDay(rs.getBoolean("fullDay")) //
            .rruleset(rs.getString("rruleset")) //
            .osmLocId(rs.getString("osmLocId")) //
            .build();
    }
}
