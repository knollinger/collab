package org.knollinger.workingtogether.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.services.ICheckDuplicateInodesService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class CheckDuplicateInodesServiceImpl implements ICheckDuplicateInodesService
{
    private static final String SQL_SELECT_DUPLICATES = "" //
        + "select `uuid`" //
        + "  from `inodes`" //
        + "  where `parent`=? and `name`=?";

    @Autowired
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public List<INode> checkDuplicates(UUID targetId, List<INode> sources) throws TechnicalFileSysException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_SELECT_DUPLICATES);
            stmt.setString(1, targetId.toString());
            for (INode source : sources)
            {
                stmt.setString(2, source.getName());
                rs = stmt.executeQuery();
                if (rs.next())
                {
                    result.add(source);
                }
                this.dbSvc.closeQuitely(rs);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("???", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }
}
