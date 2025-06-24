package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.IPlacesService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class PlacesServiceImpl implements IPlacesService
{
    private static final String ERR_LIST_PLACES = "" //
        + "Die Liste der Orte für den Benutzer '%1$s' konnte nicht geladen werden.";

    private static final String ERR_DELETE_PLACES = "" //
        + "Die Das löschen eines Eintrags für den Benutzer '%1$s' konnte nicht durchgeführt werden.";

    private static final String SQL_GET_PLACES = "" //
        + "select `uuid`, `name`, `parent`, `owner`, `group`, `perms`, `size`, `type`, `created`, `modified` from `inodes`" //
        + "  where `uuid` in (" //
        + "    select `refId` from `places` where `userId`=?" //
        + "  )" //
        + "  order by name";

    private static final String SQL_ADD_PLACE = "" //
        + "insert into `places`" //
        + "  set `userId`=?, `refId`=?";
    
    private static final String SQL_DELETE_PLACE = "" //
        + "delete from `places`" //
        + "  where `userId`=? and `refId`=?";

    @Autowired
    private IDbService dbSvc;

    @Override
    public List<INode> getPlaces(UUID userId) throws TechnicalFileSysException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_PLACES);
            stmt.setString(1, userId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INode inode = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(UUID.fromString(rs.getString("parent"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group"))) //
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
            String msg = String.format(ERR_LIST_PLACES, userId.toString());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    @Override
    public void deletePlace(UUID userId, UUID inodeId) throws TechnicalFileSysException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_DELETE_PLACE);
            stmt.setString(1, userId.toString());
            stmt.setString(2, inodeId.toString());
            if (stmt.executeUpdate() == 0)
            {

            }
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_DELETE_PLACES, userId.toString());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    @Override
    public void addPlaces(UUID userId, List<INode> nodes) throws TechnicalFileSysException, DuplicateEntryException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            stmt = conn.prepareStatement(SQL_ADD_PLACE);
            stmt.setString(1, userId.toString());

            for (INode node : nodes)
            {
                stmt.setString(2, node.getUuid().toString());
                stmt.executeUpdate();
            }

            conn.commit();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateEntryException(nodes, e);
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_LIST_PLACES, userId.toString());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }
}
