package org.knollinger.colab.utils.services.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author anderl
 *
 */
@Service
public class DbServiceImpl implements IDbService
{
    private static final String URL_TEMPLATE = "jdbc:mysql://%1$s:%2$d/%3$s?user=%4$s&password=%5$s&serverTimezone=UTC&useLegacyDatetimeCode=false";
    
    @Value("${db.host}")
    private String dbHost;

    @Value("${db.port}")
    private int dbPort;

    @Value("${db.name}")
    private String dbName;

    @Value("${db.user}")
    private String dbUser;

    @Value("${db.passwd}")
    private String dbPasswd;

    /* (non-Javadoc)
     * @see org.heavensgate.cambackend.services.IDbService#openConnection()
     */
    public Connection openConnection() throws SQLException
    {
        String url = String.format(URL_TEMPLATE, dbHost, dbPort, dbName, dbUser, dbPasswd);
        return DriverManager.getConnection(url);
    }

    /*
     * (non-Javadoc)
     * 
     * @see org.heavensgate.cambackend.services.IDbService#closeQuitely(java.sql.
     * Connection)
     */
    @Override
    public void closeQuitely(Connection conn)
    {
        try
        {
            if (conn != null)
            {
                conn.close();
            }
        }
        catch (Exception e)
        {
            // Quitely means quitely!
        }
    }

    /*
     * (non-Javadoc)
     * 
     * @see org.heavensgate.cambackend.services.IDbService#closeQuitely(java.sql.
     * PreparedStatement)
     */
    @Override
    public void closeQuitely(PreparedStatement stmt)
    {
        try
        {
            if (stmt != null)
            {
                stmt.close();
            }
        }
        catch (Exception e)
        {
            // Quitely means quitely!
        }
    }

    /*
     * (non-Javadoc)
     * 
     * @see org.heavensgate.cambackend.services.IDbService#closeQuitely(java.sql.
     * ResultSet)
     */
    @Override
    public void closeQuitely(ResultSet rs)
    {
        try
        {
            if (rs != null)
            {
                rs.close();
            }
        }
        catch (Exception e)
        {
            // Quitely means quitely!
        }
    }
}

