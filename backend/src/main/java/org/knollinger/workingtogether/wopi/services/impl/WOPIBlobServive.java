package org.knollinger.workingtogether.wopi.services.impl;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.UUID;

import org.knollinger.workingtogether.utils.services.IDbService;
import org.knollinger.workingtogether.wopi.exceptions.TechnicalWOPIException;
import org.knollinger.workingtogether.wopi.services.WOPIBlobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class WOPIBlobServive implements WOPIBlobService
{
    private static final String SQL_UPDATE_BLOB = "" //
        + "update inodes set data=?" //
        + "  where uuid=?";
    
    @Autowired()
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public void saveFile(UUID fileId, InputStream blob) throws TechnicalWOPIException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try(BufferedInputStream bufIn = new BufferedInputStream(blob))
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_UPDATE_BLOB);
            stmt.setBinaryStream(1, bufIn);
            stmt.setString(2,  fileId.toString());
            stmt.executeUpdate(); // Count auswerten!
        }
        catch (SQLException | IOException e)
        {
            throw new TechnicalWOPIException("", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }
}
