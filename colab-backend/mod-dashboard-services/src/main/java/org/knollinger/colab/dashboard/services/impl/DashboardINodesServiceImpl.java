package org.knollinger.colab.dashboard.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;
import org.knollinger.colab.dashboard.services.IDashboardINodesService;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class DashboardINodesServiceImpl implements IDashboardINodesService
{
    private static final String SQL_LOAD_INODES = "" //
        + "select `uuid`, `name`, `parent`, `owner`, `group`, `perms`, `size`, `type`, `created`, `modified` from `inodes`" //
        + "  where `uuid` in (" //
        + "    select refId from dashboard_links where owner=? and refType='INODES'" //
        + "  )" //
        + "  order by name";

    @Autowired
    private IDbService dbSvc;

    @Autowired
    private ICurrentUserService currUserSvc;

    /**
     *
     */
    @Override
    public List<INode> loadINodes() throws TechnicalDashboardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            UUID userId = currUserSvc.get().getUser().getUserId();
            List<INode> result = new ArrayList<>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_LOAD_INODES);
            stmt.setString(1, userId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INode inode = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(UUID.fromString(rs.getString("parent"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group")))//
                    .perms(rs.getShort("perms")) //
                    .name(rs.getString("name")) //
                    .type(rs.getString("type")) //
                    .size(rs.getLong("size")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
                result.add(inode);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalDashboardException("", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }
}
