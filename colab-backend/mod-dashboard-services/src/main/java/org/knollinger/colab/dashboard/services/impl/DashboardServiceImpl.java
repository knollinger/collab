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
            System.err.println(stmt.toString());
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
}
