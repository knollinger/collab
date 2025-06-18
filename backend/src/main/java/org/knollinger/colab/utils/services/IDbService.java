package org.knollinger.colab.utils.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @author anderl
 *
 */
public interface IDbService
{
    /**
     * @return
     */
    public Connection openConnection() throws SQLException;
    
    /**
     * @param conn
     */
    public void closeQuitely(Connection conn);
    
    /**
     * @param stmt
     */
    public void closeQuitely(PreparedStatement stmt);
    
    /**
     * @param rs
     */
    public void closeQuitely(ResultSet rs);
}
