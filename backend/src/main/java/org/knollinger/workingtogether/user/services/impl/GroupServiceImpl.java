package org.knollinger.workingtogether.user.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.user.exceptions.TechnicalGroupException;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.services.IGroupService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupServiceImpl implements IGroupService
{
    private static final String SQL_GET_ALL_GROUPS = "" //
        + "select `uuid`, `name`, `primary`" //
        + "  from `userGroups`" //"
        + "  order by name";

    @Autowired
    private IDbService dbService;

    @Override
    public List<Group> getAllGroups() throws TechnicalGroupException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<Group> result = new ArrayList<>();

            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_GROUPS);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                Group g = Group.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .name(rs.getString("name")).primary(rs.getBoolean("primary")).build();
                result.add(g);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalGroupException(
                "Die Liste der Gruppen konnte aufgrund eines technischen Fehlers nicht geladen werden.", e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }
}
