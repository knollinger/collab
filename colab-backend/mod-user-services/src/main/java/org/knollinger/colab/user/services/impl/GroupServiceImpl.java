package org.knollinger.colab.user.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.knollinger.colab.user.exceptions.DuplicateGroupException;
import org.knollinger.colab.user.exceptions.GroupNotFoundException;
import org.knollinger.colab.user.exceptions.TechnicalGroupException;
import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.services.IGroupService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

/**
 * Liefer die Auflistung aller Gruppen
 */
@Service
@Log4j2
public class GroupServiceImpl implements IGroupService
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

    private static final String SQL_CREATE_GROUP = "" //
        + "insert into `groups`" //
        + "  set `uuid`=?, `name`=?, `isPrimary`=?";

    private static final String SQL_DELETE_MEMBERS = "" //
        + "delete from groupMembers" //
        + "  where parentId=?";

    private static final String SQL_INSERT_MEMBER = "" //
        + "insert into groupMembers" //
        + "  set parentId=?, memberId=?";

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
    public List<Group> getGroupsByUser(UUID userId) throws TechnicalGroupException
    {
        Connection conn = null;

        try
        {
            conn = this.dbService.openConnection();
            Set<UUID> allGroupIds = this.getGroupIdsRecursive(userId, conn);
            log.info("groupIds: {}", allGroupIds);

            List<Group> allGroups = this.resolveAllGroupIDs(allGroupIds, conn);
            log.info("allGroups: {}", allGroups);
            return allGroups;
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_GET_USER_GROUPS, userId.toString());
            throw new TechnicalGroupException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(conn);
        }
    }


    /**
     * Löse Rekursiv das Set aller GroupIds auf, ausgehend von einer gegebenen GroupId
     * 
     * @param groupId
     * @param conn
     * @return
     * @throws SQLException
     */
    private Set<UUID> getGroupIdsRecursive(UUID groupId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            Set<UUID> result = new HashSet<>();
            result.add(groupId);

            stmt = conn.prepareStatement("select parentId from groupMembers where memberId=?");
            stmt.setString(1, groupId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                UUID parentId = UUID.fromString(rs.getString("parentId"));
                result.add(parentId);

                // PrimärGruppen beinhalten die BenutzerId als Member und diese hat den selben Wert wie
                // die GruppenId. In diesem Fall darf nicht weiter rekursiv gescannt werden, es würde
                // in einer Endlos-Rekursion enden!
                if (!parentId.equals(groupId))
                {
                    result.addAll(this.getGroupIdsRecursive(parentId, conn));
                }
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
     * Löse das Set der GroupIds in eine Liste der Gruppen auf
     * 
     * @param groupIds
     * @param conn
     * @return
     * @throws SQLException
     */
    private List<Group> resolveAllGroupIDs(Set<UUID> groupIds, Connection conn) throws SQLException
    {

        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<Group> result = new ArrayList<>();
            stmt = conn.prepareStatement("select `name`, `isPrimary` from `groups` where `uuid`=?");

            for (UUID groupId : groupIds)
            {
                stmt.setString(1, groupId.toString());
                rs = stmt.executeQuery();
                while (rs.next())
                {
                    Group g = Group.builder() //
                        .uuid(groupId) //
                        .name(rs.getString("name")).primary(rs.getBoolean("isPrimary")) //
                        .build();
                    result.add(g);
                }
                this.dbService.closeQuitely(rs);
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
    public void saveGroupMembers(Group parent, List<Group> members)
        throws GroupNotFoundException, TechnicalGroupException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            conn = this.dbService.openConnection();
            conn.setAutoCommit(false);

            stmt = conn.prepareStatement(SQL_DELETE_MEMBERS);
            stmt.setString(1, parent.getUuid().toString());
            stmt.executeUpdate();
            this.dbService.closeQuitely(stmt);

            stmt = conn.prepareStatement(SQL_INSERT_MEMBER);
            stmt.setString(1, parent.getUuid().toString());
            for (Group group : members)
            {
                stmt.setString(2, group.getUuid().toString());
                stmt.executeUpdate();
            }

            conn.commit();
        }
        catch (SQLException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public Group createGroup(String name, boolean isPrimary) throws DuplicateGroupException, TechnicalGroupException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            UUID uuid = UUID.randomUUID();
            
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_CREATE_GROUP);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, name);
            stmt.setBoolean(3, isPrimary);
            stmt.executeUpdate();
            
            return Group.builder() //
                .uuid(uuid) //
                .name(name) //
                .primary(isPrimary) //
                .build();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateGroupException(name);
        }
        catch (SQLException e)
        {
            throw new TechnicalGroupException(name, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }
}
