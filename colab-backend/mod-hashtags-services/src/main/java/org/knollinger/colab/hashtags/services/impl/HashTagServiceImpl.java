package org.knollinger.colab.hashtags.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.hashtags.exceptions.TechnicalHashTagException;
import org.knollinger.colab.hashtags.models.EHashTagType;
import org.knollinger.colab.hashtags.services.IHashTagService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HashTagServiceImpl implements IHashTagService
{
    private static final String ERR_READ_HASHTAGS = "" //
        + "Die Liste aller Hashtags konnte nicht gelesen werden.";

    private static final String ERR_READ_RESOURCE_HASHTAGS = "" //
        + "Die Liste der Hashtags für die Resource '%1$s' konnte nicht gelesen werden.";
    
    private static final String ERR_SAVE_HASHTAGS = "" //
        + "Die Hashtags für die Resource '%1$s' konnten nicht gespeichert werden.";
    
    private static final String SQL_GET_ALL_HASHTAGS = "" //
        + "select distinct name from hashtags" //
        + "  order by name";

    private static final String SQL_RESOURCE_HASHTAGS = "" //
        + "select name from hashtags" //
        + "  where refId=?"
        + "  order by name";
    
    private static final String SQL_DELETE_HASHTAGS = "" //
        + "delete from hashtags where refId=?";
    
    private static final String SQL_INSERT_HASHTAG = "" //
        + "insert into hashtags set refId=?, type=?, name=?";
    
    @Autowired()
    private IDbService dbSvc;

    @Override
    public List<String> getAllHashTags() throws TechnicalHashTagException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<String> result = new ArrayList<>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_HASHTAGS);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                String tag = rs.getString("name").toLowerCase();
                result.add(tag);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalHashTagException(ERR_READ_HASHTAGS, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public List<String> getHashTagsByResource(UUID uuid) throws TechnicalHashTagException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            return this.getHashTagsByResource(uuid, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalHashTagException(ERR_READ_RESOURCE_HASHTAGS, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public List<String> getHashTagsByResource(UUID uuid, Connection conn) throws TechnicalHashTagException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<String> result = new ArrayList<>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_RESOURCE_HASHTAGS);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                String tag = rs.getString("name").toLowerCase();
                result.add(tag);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalHashTagException(ERR_READ_RESOURCE_HASHTAGS, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }

    @Override
    public void saveHashTags(UUID refId, List<String> tags, EHashTagType type) throws TechnicalHashTagException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);
            this.saveHashTags(refId, tags, type, conn);
            
            conn.commit();
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_SAVE_HASHTAGS, refId.toString());
            throw new TechnicalHashTagException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    @Override
    public void saveHashTags(UUID refId, List<String> tags, EHashTagType type, Connection conn) throws TechnicalHashTagException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            this.removeHashTagsByRefId(refId, conn);
            
            stmt = conn.prepareStatement(SQL_INSERT_HASHTAG);
            stmt.setString(1, refId.toString());
            stmt.setString(2, type.toString());
            for (String tag : tags)
            {
                stmt.setString(3, tag);
                stmt.executeUpdate();
            }
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_SAVE_HASHTAGS, refId.toString());
            throw new TechnicalHashTagException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }

    @Override
    public void removeHashTagsByRefId(UUID refId, Connection conn) throws TechnicalHashTagException
    {
        PreparedStatement stmt = null;
        try
        {
            stmt = conn.prepareStatement(SQL_DELETE_HASHTAGS);
            stmt.setString(1, refId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            String msg = String.format(ERR_SAVE_HASHTAGS, refId.toString());
            throw new TechnicalHashTagException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }
}
