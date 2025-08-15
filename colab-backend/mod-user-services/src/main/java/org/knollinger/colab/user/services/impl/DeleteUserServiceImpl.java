package org.knollinger.colab.user.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.UUID;

import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;
import org.knollinger.colab.user.services.IDeleteUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteUserServiceImpl implements IDeleteUserService
{
    private static final String ERR_DELETE_USER = "" //
        + "Der Benutzer mit der UUID '%1$s' konnte nicht gelöscht werden";

    private static final String SQL_DELETE_FILES = "delete from inodes where owner=?";
    private static final String SQL_DELETE_GROUP_MEMBERS = "delete from group_members where memberId=?";
    private static final String SQL_DELETE_PRIMARY_GROUP = "delete from groups where uuid=?";
    private static final String SQL_DELETE_CALENDAR = "delete from calendar where owner=?";
    private static final String SQL_DELETE_SETTINGS = "delete from settings where owner=?";
    private static final String SQL_DELETE_DASHBOARD_LINKS = "delete from dashboard_links where owner=?";
    private static final String SQL_DELETE_DASHBOARD_WIDGETS = "delete from dashboard_widgets where owner=?";
    private static final String SQL_DELETE_USER = "delete from user where uuid=?";

    private static final String[] ALL_SQLS = {
        DeleteUserServiceImpl.SQL_DELETE_FILES, //
        DeleteUserServiceImpl.SQL_DELETE_GROUP_MEMBERS, //
        DeleteUserServiceImpl.SQL_DELETE_PRIMARY_GROUP, //
        DeleteUserServiceImpl.SQL_DELETE_CALENDAR, //
        DeleteUserServiceImpl.SQL_DELETE_SETTINGS, //
        DeleteUserServiceImpl.SQL_DELETE_DASHBOARD_LINKS,
        DeleteUserServiceImpl.SQL_DELETE_DASHBOARD_WIDGETS, //
        DeleteUserServiceImpl.SQL_DELETE_USER //
    };
    
    @Autowired
    private IDbService dbSvc;

    @Override
    public void deleteUser(UUID uuid) throws TechnicalUserException, UserNotFoundException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            for (String sql : ALL_SQLS)
            {
                this.deleteObjects(sql, uuid, conn);                
            }

            conn.commit();
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_DELETE_USER, uuid.toString());
            throw new TechnicalUserException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    private void deleteObjects(String sql, UUID uuid, Connection conn) throws SQLException
    {
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, uuid.toString());
        stmt.executeUpdate();
        
    }
}
