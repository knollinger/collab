package org.knollinger.colab.user.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.UUID;

import org.knollinger.colab.user.exceptions.GroupNotFoundException;
import org.knollinger.colab.user.exceptions.TechnicalGroupException;
import org.knollinger.colab.user.services.IDeleteGroupService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteGroupServiceImpl implements IDeleteGroupService
{
    private static final String ERR_DELETE_GROUP = "" //
        + "Die Gruppe mit der UUID '%1$s' konnte nicht gelöscht werden.";
    
    private static final String SQL_REMOVE_GROUP_MEMBERSHIP = "" //
        + "delete from groupMembers" //
        + "  where parentId=? or memberId=?";

    private static final String SQL_ADJUST_FILESYS_OWNERSHIP = "" //
        + "update `inodes`" //
        + "  set `group`=`owner`" //
        + "  where `group`=?";

    private static final String SQL_DELETE_GROUP = "" //
        + "delete from groups" //
        + "  where uuid=?";

    @Autowired
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public void deleteGroup(UUID groupId) throws TechnicalGroupException, GroupNotFoundException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);
            
            this.removeGroupMembership(groupId, conn);
            this.adjustFilesysOwnership(groupId, conn);
            this.deleteGroup(groupId, conn);
            
            conn.commit();
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            String msg = String.format(ERR_DELETE_GROUP, groupId.toString());
            throw new TechnicalGroupException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * Lösche alle Gruppen-Mitgliedschaften. Also Untergruppen und Parent-Zuordnungen.
     * @param groupId
     * @param conn
     * @throws SQLException
     */
    private void removeGroupMembership(UUID groupId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_REMOVE_GROUP_MEMBERSHIP);
            stmt.setString(1, groupId.toString());
            stmt.setString(2, groupId.toString());
            stmt.executeUpdate();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * @param groupId
     * @param conn
     * @throws SQLException
     */
    private void adjustFilesysOwnership(UUID groupId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_ADJUST_FILESYS_OWNERSHIP);
            stmt.setString(1, groupId.toString());
            stmt.executeUpdate();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * @param groupId
     * @param conn
     * @throws SQLException
     */
    private void deleteGroup(UUID groupId, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_DELETE_GROUP);
            stmt.setString(1, groupId.toString());
            stmt.executeUpdate();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }
}
