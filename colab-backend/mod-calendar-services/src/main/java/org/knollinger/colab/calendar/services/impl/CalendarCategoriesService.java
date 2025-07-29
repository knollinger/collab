package org.knollinger.colab.calendar.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.models.CalendarEventCategoryDescription;
import org.knollinger.colab.calendar.models.ECalendarEventCategory;
import org.knollinger.colab.calendar.services.ICalendarCategoriesService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalendarCategoriesService implements ICalendarCategoriesService
{
    private static final String SQL_GET_ALL = "" //
        + "select `category`, `color`, `desc`" //
        + "  from `calendar_categories`" //
        + "  order by `desc`";
    
    @Autowired()
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public List<CalendarEventCategoryDescription> getAllCategories() throws TechnicalCalendarException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<CalendarEventCategoryDescription> result = new ArrayList<>();
            
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                CalendarEventCategoryDescription desc = CalendarEventCategoryDescription.builder() //
                    .category(ECalendarEventCategory.valueOf(rs.getString("category"))) //
                    .color(rs.getString("color")) //
                    .desc(rs.getString("desc")) //
                    .build();
                result.add(desc);
            }
            return result;
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            throw new TechnicalCalendarException("Die Liste der Ereignis-Kategorien konnte nicht geladen werden", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(stmt);
        }
    }
}
