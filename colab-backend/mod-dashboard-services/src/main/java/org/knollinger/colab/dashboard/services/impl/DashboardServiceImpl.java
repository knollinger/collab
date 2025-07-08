package org.knollinger.colab.dashboard.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.dashboard.data.DashboardWidgetDesc;
import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;
import org.knollinger.colab.dashboard.services.IDashboardService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements IDashboardService
{
    private static final String SQL_GET_WIDGETS = "" //
        + "select uuid, type, height, width from dashboard_widgets" //
        + "  where owner=?" //
        + "  order by ordinal";

    private static final String SQL_ADD_WIDGET = "" //
        + "insert into dashboard_widgets" //
        + "  set uuid=?, type=?, height=?, width=?, owner=?, ordinal=?";

    private static final String SQL_NEXT_ORDINAL = "" //
        + "select MAX(ordinal) as maxOrdinal from dashboard_widgets" //
        + "  where owner=?";

    private static final String SQL_DELETE_WIDGET = "" //
        + "delete from dashboard_widgets" //
        + "  where uuid=?";
    
    private static final String SQL_ADD_LINK = "" //
        + " insert into dashboard_links" //
        + "   set owner=?, refId=?, refType=?";

    @Autowired
    private IDbService dbSvc;

    @Autowired
    private ICurrentUserService userSvc;

    @Override
    public List<DashboardWidgetDesc> loadWidgets() throws TechnicalDashboardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<DashboardWidgetDesc> result = new ArrayList<>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_WIDGETS);
            stmt.setString(1, this.userSvc.get().getUser().getUserId().toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                DashboardWidgetDesc widget = DashboardWidgetDesc.builder() //
                    .id(UUID.fromString(rs.getString("uuid"))) //
                    .widgetType(rs.getString("type")) //
                    .height(rs.getInt("height")) //
                    .width(rs.getInt("width")) //
                    .build();
                result.add(widget);
            }
            return result;
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            throw new TechnicalDashboardException("Das dasboard konnte nicht geladen werden.", e);
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
    public DashboardWidgetDesc addWidget(String typeName) throws TechnicalDashboardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            UUID uuid = UUID.randomUUID();
            UUID userId = this.userSvc.get().getUser().getUserId();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_ADD_WIDGET);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, typeName);
            stmt.setInt(3, 1);
            stmt.setInt(4, 1);
            stmt.setString(5, userId.toString());
            stmt.setInt(6, this.getNextOrdinal(userId, conn));
            stmt.executeUpdate();

            return DashboardWidgetDesc.builder() //
                .id(uuid) //
                .widgetType(typeName) //
                .width(1) //
                .height(1) //
                .build();
        }
        catch (SQLException e)
        {
            throw new TechnicalDashboardException("Das neue Widget konnte nicht gespeichert werden", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    private int getNextOrdinal(UUID ownerId, Connection conn) throws SQLException
    {

        PreparedStatement stmt = null;
        ResultSet rs = null;

        int ordinal = 0;
        stmt = conn.prepareStatement(SQL_NEXT_ORDINAL);
        stmt.setString(1, ownerId.toString());
        rs = stmt.executeQuery();
        if (rs.next())
        {
            ordinal = rs.getInt("maxOrdinal");
        }
        return ordinal + 1;
    }

    /**
     *
     */
    @Override
    public void deleteWidget(UUID widgetId) throws TechnicalDashboardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_DELETE_WIDGET);
            stmt.setString(1, widgetId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalDashboardException("Das Widget konnte nicht gelöscht werden", e);
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
    public void addLink(UUID refId, String refType) throws TechnicalDashboardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_ADD_LINK);
            stmt.setString(1,  this.userSvc.get().getUser().getUserId().toString());
            stmt.setString(2, refId.toString());
            stmt.setString(3, refType);
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalDashboardException("Der Link konnte nicht gespeichert werden", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }

    }
}
