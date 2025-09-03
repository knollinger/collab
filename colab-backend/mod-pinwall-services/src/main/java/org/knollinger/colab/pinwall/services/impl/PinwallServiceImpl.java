package org.knollinger.colab.pinwall.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinwall.exc.NotFoundException;
import org.knollinger.colab.pinwall.exc.TechnicalPinwallException;
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

    private static final String SQL_UPDATE = "" //
        + "update `pinwalls` set `owner`=?, `type`=?, `title`=?, `content`=?" //
        + "  where `uuid`=?";

    private static final String SQL_CREATE = "" //
        + "insert into `pinwalls`" //
        + "  set `uuid`=?\", `owner`=?, `type`=?, `title`=?, `content`=?";

    @Autowired()
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public List<PostIt> getAll() throws TechnicalPinwallException
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
            throw new TechnicalPinwallException(ERR_LOAD_ALL, e);
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
    public PostIt get(UUID uuid) throws TechnicalPinwallException, NotFoundException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            return this.get(uuid, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalPinwallException(ERR_LOAD_ALL, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws TechnicalPinwallException
     * @throws NotFoundException
     */
    private PostIt get(UUID uuid, Connection conn) throws TechnicalPinwallException, NotFoundException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<PostIt> result = new ArrayList<>();
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
            throw new TechnicalPinwallException(ERR_LOAD_ALL, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
        }
    }
    
    /**
     *
     */
    @Override
    public PostIt create(PostIt postIt) throws TechnicalPinwallException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            UUID uuid = UUID.randomUUID();
            
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_CREATE);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, postIt.getOwner().toString());
            stmt.setString(3, postIt.getType().name());
            stmt.setString(4, postIt.getTitle());
            stmt.setString(5, postIt.getContent());
            return this.get(uuid, conn);
        }
        catch (SQLException | NotFoundException e)
        {
            throw new TechnicalPinwallException("unable to save postit", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public PostIt update(PostIt postIt) throws TechnicalPinwallException, NotFoundException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_UPDATE);
            stmt.setString(1, postIt.getOwner().toString());
            stmt.setString(2, postIt.getType().name());
            stmt.setString(3, postIt.getTitle());
            stmt.setString(4, postIt.getContent());
            stmt.setString(5, postIt.getUuid().toString());
            if (stmt.executeUpdate() != 1)
            {
                throw new NotFoundException(postIt.getUuid());
            }
            return this.get(postIt.getUuid());
        }
        catch (SQLException e)
        {
            throw new TechnicalPinwallException("unable to save postit", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public void delete(UUID uuid) throws TechnicalPinwallException, NotFoundException
    {

    }
}
