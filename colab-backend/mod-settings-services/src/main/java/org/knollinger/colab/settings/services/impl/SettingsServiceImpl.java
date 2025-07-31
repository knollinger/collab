package org.knollinger.colab.settings.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.knollinger.colab.settings.exc.TechnicalSettingsException;
import org.knollinger.colab.settings.services.ISettingsService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class SettingsServiceImpl implements ISettingsService
{

    private static final String SQL_GET_LOB = "" //
        + "select settings from settings" //
        + "  where owner=?";

    private static final String SQL_INSERT_OR_UPDATE = "" //
        + "insert into settings set owner=?, settings=?" //
        + "  on duplicate key update settings=?";

    @Autowired()
    private IDbService dbSvc;

    @Autowired()
    private ICurrentUserService currUserSvc;

    @Override
    public String getSettingsLOB() throws TechnicalSettingsException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            String result = "{}";
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_LOB);
            stmt.setString(1, this.currUserSvc.getUser().getUserId().toString());
            rs = stmt.executeQuery();
            if (rs.next())
            {
                result = rs.getString("settings");
            }
            return result;

        }
        catch (SQLException e)
        {
            throw new TechnicalSettingsException("Die Benutzer-Einstellungen konnten nicht geladen werden.", e);
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
    public void saveSettingsLOB(String lob) throws TechnicalSettingsException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_INSERT_OR_UPDATE);
            stmt.setString(1, this.currUserSvc.getUser().getUserId().toString());
            stmt.setString(2, lob);
            stmt.setString(3, lob);
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalSettingsException("Die Benutzer-Einstellungen konnten nicht geladen werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);

        }
    }
}
