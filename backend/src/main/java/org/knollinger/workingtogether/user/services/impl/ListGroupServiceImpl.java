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
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.IListGroupService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Liefer die Auflistung aller Gruppen
 */
@Service
public class ListGroupServiceImpl implements IListGroupService
{
    private static final String SQL_GET_ALL_GROUPS = "" //
        + "select `uuid`, `name`, `isPrimary`" //
        + "  from `groups`" //
        + "  order by isPrimary desc, name asc";

    private static final String SQL_GET_MEMBERS = "" //
        + "select uuid, name, isPrimary" //
        + "  from groups" //
        + "  where uuid in" // 
        + "    (select memberId from groupMembers where parentId=?)" //
        + "  order by name";

    private static final String SQL_GET_USER_GROUPS = "" //
        + "select uuid, name, isPrimary from `groups`" // 
        + "  where uuid in (" //
        + "    select parentId from groupMembers where memberId=?" //
        + "  )";

    private static final String ERR_GET_USER_GROUPS = "" //
        + "Die Gruppen-Zugehörigkeiten für den Benutzer mit der " //
        + "UUID '%14s' konnten aufgrund eines technischen Problems nicht ermittelt werden";
    
    @Autowired
    private IDbService dbService;

    /**
     *
     */
    @Override
    public List<Group> getAllGroups(//
        boolean deepScan) throws TechnicalGroupException
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
                boolean isPrimary = rs.getBoolean("isPrimary");
                UUID groupId = UUID.fromString(rs.getString("uuid"));

                List<Group> members = new ArrayList<>();
                if (deepScan && !isPrimary)
                {
                    members = this.getMembers(groupId, conn);
                }

                Group g = Group.builder() //
                    .uuid(groupId) //
                    .name(rs.getString("name")) //
                    .primary(isPrimary) //
                    .members(members) //
                    .build();
                result.add(g);
            }
            return result;
        }
        catch (SQLException e)
        {
            e.printStackTrace();
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

    /**
     * @param parentId
     * @param conn
     * @return
     * @throws SQLException 
     */
    private List<Group> getMembers(UUID parentId, Connection conn) throws SQLException
    {
        List<Group> result = new ArrayList<>();
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_MEMBERS);
            stmt.setString(1, parentId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                List<Group> members = new ArrayList<>();
                UUID childId = UUID.fromString(rs.getString("uuid"));
                boolean isPrimary = rs.getBoolean("isPrimary");
                if (!isPrimary)
                {
                    members = this.getMembers(childId, conn);
                }

                Group g = Group.builder() //
                    .uuid(childId) //
                    .name(rs.getString("name")) //
                    .primary(isPrimary) //
                    .members(members) //
                    .build();
                result.add(g);
            }
            return result;
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }

    /**
     *
     */
    @Override
    public List<Group> getGroupsByUser(User user) throws TechnicalGroupException
    {
        List<Group> result = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_GET_USER_GROUPS);
            stmt.setString(1, user.getUserId().toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                Group g = Group.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .name(rs.getString("name")) //
                    .primary(rs.getBoolean("isPrimary"))
                    .build();
                result.add(g);
            }
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_GET_USER_GROUPS, user.getUserId().toString());
            throw new TechnicalGroupException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }
}
