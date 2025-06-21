package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.services.ICheckDuplicateInodesService;
import org.knollinger.colab.utils.services.IDbService;
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
    public List<String> checkDuplicates(UUID targetId, List<String> names) throws TechnicalFileSysException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<String> result = new ArrayList<>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_SELECT_DUPLICATES);
            stmt.setString(1, targetId.toString());
            for (String name : names)
            {
                stmt.setString(2, name);
                rs = stmt.executeQuery();
                if (rs.next())
                {
                    result.add(name);
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
