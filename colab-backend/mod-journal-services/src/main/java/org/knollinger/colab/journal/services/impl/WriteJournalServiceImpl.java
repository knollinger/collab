package org.knollinger.colab.journal.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.IllegalFormatException;
import java.util.MissingResourceException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.knollinger.colab.journal.services.IWriteJournalService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WriteJournalServiceImpl implements IWriteJournalService
{
    private static final String SQL_WRITE_ENTRY = "" //
        + "insert into `journal`" //
        + "  set `uuid`=?, `user`=?, `entry`=?";

    @Autowired()
    private IDbService dbSvc = null;

    @Autowired()
    private ICurrentUserService currUserSvc;

    private ConcurrentHashMap<String, PropertyResourceBundle> catalogs = new ConcurrentHashMap<>();

    /**
     *
     */
    @Override
    public void writeJournal(Enum<?> logId, Object... args)
    {
        Connection conn = null;
        try
        {
            this.dbSvc.openConnection();
            this.writeJournal(conn, logId, args);
        }
        catch (SQLException e)
        {
            // TODO: write log entry
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
    public void writeJournal(Connection conn, Enum<?> logId, Object... args)
    {
        PreparedStatement stmt = null;
        try
        {
            stmt = conn.prepareStatement(SQL_WRITE_ENTRY);
            stmt.setString(1, UUID.randomUUID().toString());
            stmt.setString(2, this.currUserSvc.getUser().getUserId().toString());
            stmt.setString(3, this.formatMsg(logId, args));
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * 
     * @param logId
     * @param args
     * @return
     */
    private String formatMsg(Enum<?> logId, Object... args)
    {
        String msg = null;

        try
        {
            PropertyResourceBundle catalog = this.getMsgCatalog(logId);
            String format = catalog.getString(logId.name());
            msg = String.format(format, args);
        }
        catch (MissingResourceException | IllegalFormatException e)
        {
            // TODO: schreibe einen LogEntry
        }
        return (msg != null) ? msg : this.createDefaultMsg(logId, args);
    }

    /**
     * @param logId
     * @param args
     * @return
     */
    private String createDefaultMsg(Enum<?> logId, Object[] args)
    {
        return new StringBuilder() //
            .append(logId.name()) //
            .append(": ") //
            .append(args.toString()) //
            .toString();

    }

    /**
     * @param logId
     * @return
     */
    private PropertyResourceBundle getMsgCatalog(Enum<?> logId)
    {
        String catName = logId.getClass().getName();
        PropertyResourceBundle result = this.catalogs.get(catName);
        if (result == null)
        {
            result = (PropertyResourceBundle) ResourceBundle.getBundle(catName);
            if (result != null)
            {
                this.catalogs.put(catName, result);
            }
        }
        return result;
    }
}
