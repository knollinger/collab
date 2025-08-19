package org.knollinger.colab.pinwall.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinwall.exc.NotFoundException;
import org.knollinger.colab.pinwall.exc.TechnicalPillwallException;
import org.knollinger.colab.pinwall.models.EPostItType;
import org.knollinger.colab.pinwall.models.PostIt;
import org.knollinger.colab.pinwall.services.IPinwallService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class PinwallServiceImpl implements IPinwallService
{
    private static final String ERR_LOAD_ALL = "Die Liste der PostIts konnte nicht geladen werden.";

    private static final String SQL_GET_ALL = "" //
        + "select `uuid`, `owner`, `type`, `title`, `content`, `created`, `modified`" //
        + "  from `pinwalls`" //
        + "  order by `created`";

    private static final String SQL_GET = "" //
        + "select `owner`, `type`, `title`, `content`, `created`, `modified`" //
        + "  from `pinwalls`" //
        + "  where `uuid`=?";

    @Autowired()
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public List<PostIt> getAll() throws TechnicalPillwallException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<PostIt> result = new ArrayList<>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                PostIt postIt = PostIt.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .type(EPostItType.valueOf(rs.getString("type"))) //
                    .title(rs.getString("title")) //
                    .content(rs.getString("content")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
                result.add(postIt);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalPillwallException(ERR_LOAD_ALL, e);
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
    public PostIt get(UUID uuid) throws TechnicalPillwallException, NotFoundException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<PostIt> result = new ArrayList<>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new NotFoundException(uuid);
            }

            PostIt postIt = PostIt.builder() //
                .uuid(uuid) //
                .owner(UUID.fromString(rs.getString("owner"))) //
                .type(EPostItType.valueOf(rs.getString("type"))) //
                .title(rs.getString("title")) //
                .content(rs.getString("content")) //
                .created(rs.getTimestamp("created")) //
                .modified(rs.getTimestamp("modified")) //
                .build();
            result.add(postIt);

            return postIt;
        }
        catch (SQLException e)
        {
            throw new TechnicalPillwallException(ERR_LOAD_ALL, e);
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
    public PostIt create(PostIt postIt) throws TechnicalPillwallException
    {
        return null;
    }

    /**
     *
     */
    @Override
    public PostIt update(PostIt postIt) throws TechnicalPillwallException, NotFoundException
    {
        return null;
    }

    /**
     *
     */
    @Override
    public void delete(UUID uuid) throws TechnicalPillwallException, NotFoundException
    {

    }
}
