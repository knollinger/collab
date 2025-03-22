package org.knollinger.workingtogether.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.services.IDeleteService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class DeleteServiceImpl implements IDeleteService
{
    private static final String SQL_GET_CHILDS = "" //
        + "select `uuid`, `type` from `inodes`" //
        + "  where `parent`=?";

    private static final String SQL_DELETE_INODE = "" //
        + "delete from `inodes`" //
        + "  where `uuid`=?";

    private static final String ERR_DELETE_INODE = "Das Datei-System Objekt konnte aufgrund eines technischen Problems nicht gelöscht werden.";

    @Autowired
    private IDbService dbSvc;

    @Override
    public void deleteINode(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException
    {

        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            List<UUID> toDelete = new ArrayList<>();
            for (UUID uuid : uuids)
            {
                toDelete.addAll(this.collectINodes(uuid, conn));
            }

            PreparedStatement stmtINode = conn.prepareStatement(SQL_DELETE_INODE);

            for (UUID id : toDelete)
            {
                stmtINode.setString(1, id.toString());
                stmtINode.executeUpdate();
            }

            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(ERR_DELETE_INODE);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param parentId
     * @param conn
     * @return
     * @throws SQLException
     */
    private List<UUID> collectINodes(UUID parentId, Connection conn) throws SQLException
    {
        List<UUID> result = new ArrayList<>();
        result.add(parentId);

        PreparedStatement stmt = conn.prepareStatement(SQL_GET_CHILDS);
        ResultSet rs = null;

        stmt.setString(1, parentId.toString());
        rs = stmt.executeQuery();
        while (rs.next())
        {
            UUID uuid = UUID.fromString(rs.getString("uuid"));
            result.add(uuid);

            if (rs.getString("type").equalsIgnoreCase("inode/directory"))
            {
                result.addAll(this.collectINodes(uuid, conn));
            }
        }
        return result;
    }
}
