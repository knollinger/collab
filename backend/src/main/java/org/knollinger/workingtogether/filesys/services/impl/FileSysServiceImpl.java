package org.knollinger.workingtogether.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.EWellknownINodeIDs;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.services.IFileSysService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileSysServiceImpl implements IFileSysService
{
    private static final String SQL_GET_INODE = "" //
        + "select name, parent, size, type, created, modified from inodes" //
        + "  where uuid=?";

    private static final String SQL_GET_ALL_CHILDS = "" //
        + "select name, uuid, size, type, created, modified from inodes" //
        + "  where parent=?" //
        + "  order by name asc";

    private static final String SQL_CREATE_INODE = "" //
        + "insert into inodes" // 
        + "  set uuid=?, parent=?, name=?, size=?, type=?";

    private static final String SQL_RENAME_INODE = "" //
        + "update inodes set name=?" //
        + "  where uuid=?";

    private static final String SQL_GET_CHILD_BY_NAME = "" //
        + "select * from inodes" //
        + "  where parent=? and name=?";

    private static final String SQL_MOVE_INODE = "" //
        + "update inodes set parent=?" //
        + "  where uuid=?";

    @Autowired
    private IDbService dbService;

    /**
     *
     */
    @Override
    public INode getINode(UUID uuid) throws TechnicalFileSysException, NotFoundException
    {
        Connection conn = null;

        try
        {
            conn = this.dbService.openConnection();
            return this.getINode(uuid, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Die INode mit der UUID '%1$s' konnte nicht geladen werden", uuid);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(conn);
        }
    }

    private INode getINode(UUID uuid, Connection conn) throws SQLException, NotFoundException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_INODE);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new NotFoundException(uuid);
            }

            return INode.builder() //
                .uuid(uuid) //
                .parent(UUID.fromString(rs.getString("parent"))) //
                .name(rs.getString("name")).type(rs.getString("type")) //
                .size(rs.getLong("size")) //
                .created(rs.getTimestamp("created")) //
                .modified(rs.getTimestamp("modified")) //
                .build();
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }

    /**
     * @throws TechnicalFileSysException 
     *
     */
    @Override
    public List<INode> getAllChilds(UUID parentId, boolean foldersOnly) throws TechnicalFileSysException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<INode>();
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_GET_ALL_CHILDS);
            stmt.setString(1, parentId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INode node = INode.builder() // 
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(parentId) //
                    .name(rs.getString("name")) //
                    .type(rs.getString("type")) //
                    .size(rs.getLong("size")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();

                if (!foldersOnly || node.isDirectory())
                {
                    result.add(node);
                }
            }
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format("Die Elemente des Ordners mit der UUID '%1$s' konnten nicht geladen werden",
                parentId);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * @throws NotFoundException 
     *
     */
    @Override
    public List<INode> getPath(UUID uuid) throws TechnicalFileSysException, NotFoundException
    {
        Connection conn = null;

        try
        {
            conn = this.dbService.openConnection();
            return this.getPath(uuid, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Pfad zum Object mit der UUID '%1$s' konnte nicht ermittelt werden", uuid);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    public List<INode> getPath(UUID uuid, Connection conn) throws TechnicalFileSysException, NotFoundException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<INode>();
            stmt = conn.prepareStatement(SQL_GET_INODE);

            UUID currentUUID = uuid;
            while (!currentUUID.equals(EWellknownINodeIDs.NONE.value()))
            {
                stmt.setString(1, currentUUID.toString());
                rs = stmt.executeQuery();
                if (!rs.next())
                {
                    throw new NotFoundException(currentUUID);
                }
                else
                {
                    INode node = INode.builder() // 
                        .uuid(currentUUID) //
                        .parent(UUID.fromString(rs.getString("parent"))) //
                        .name(rs.getString("name")) //
                        .type(rs.getString("type")) //
                        .size(rs.getLong("size")) //
                        .created(rs.getTimestamp("created")) //
                        .modified(rs.getTimestamp("modified")) //
                        .build();
                    result.add(0, node);

                    currentUUID = node.getParent();
                }
            }
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Pfad zum Object mit der UUID '%1$s' konnte nicht ermittelt werden", uuid);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }

    /**
     *
     */
    @Override
    public void rename(UUID uuid, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        INode node = null;
        try
        {
            conn = this.dbService.openConnection();
            node = this.getINode(uuid, conn);
            if (node == null)
            {
                throw new NotFoundException(uuid);
            }

            stmt = conn.prepareStatement(SQL_RENAME_INODE);
            stmt.setString(1, name);
            stmt.setString(2, uuid.toString());
            stmt.executeUpdate();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            node = this.getChildByName(node.getParent(), name, conn);
            if (node != null)
            {
                throw new DuplicateEntryException(node);
            }
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            String msg = String.format("Das Dateisystem-Objekt mit der UUID '%1$s' konnte nicht umbenannt werden",
                uuid);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * 
     * @param parentId
     * @param originalFilename
     * @param conn
     * @return
     */
    private INode getChildByName(UUID parentId, String originalFilename, Connection conn)
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        INode result = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_CHILD_BY_NAME);
            stmt.setString(1, parentId.toString());
            stmt.setString(2, originalFilename);
            rs = stmt.executeQuery();
            if (rs.next())
            {
                result = INode.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(parentId) //
                    .name(originalFilename) //
                    .size(rs.getLong("size")) //
                    .type(rs.getString("type")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
            }
        }
        catch (SQLException e)
        {

        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
        return result;
    }

    /**
     * 
     */
    @Override
    public INode createFolder(UUID parentId, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        try
        {
            conn = this.dbService.openConnection();

            // TODO: Parent existenz und isDirectory testen
            stmt = conn.prepareStatement(SQL_CREATE_INODE);

            UUID uuid = UUID.randomUUID();

            stmt.setString(1, uuid.toString());
            stmt.setString(2, parentId.toString());
            stmt.setString(3, name.trim());
            stmt.setLong(4, 0);
            stmt.setString(5, "inode/directory");
            stmt.executeUpdate();

            Timestamp now = new Timestamp(System.currentTimeMillis());
            return INode.builder() //
                .uuid(uuid) //
                .parent(parentId) //
                .name(name.trim()) //
                .size(0) //
                .type("inode/directory") //
                .created(now) //
                .modified(now) //
                .build();
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Ordner '%1$s' konnte nicht angelegt werden", e);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public void move(List<INode> src, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException
    {
        // TODO testen, ob das objekt nicht in eines seiner kinder verschoben werden soll
        // Dazu getPath (target), die src darf nicht darin enthalten sein!

        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbService.openConnection();
            conn.setAutoCommit(false);

            for (INode iNode : src)
            {
                this.checkMoveAllowed(iNode, target, conn);

                stmt = conn.prepareStatement(SQL_MOVE_INODE);
                stmt.setString(1, target.getUuid().toString());
                stmt.setString(2, iNode.getUuid().toString());
                if (stmt.executeUpdate() == 0)
                {
                    throw new NotFoundException(iNode.getUuid());
                }
            }
            conn.commit();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateEntryException(src);
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(
                "Das verschieben des Objektes konnte aufgrund eines technischen Fehlers nicht durchgeführt werden.", e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * @param src
     * @param target
     * @param conn
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    private void checkMoveAllowed(INode src, INode target, Connection conn)
        throws TechnicalFileSysException, NotFoundException
    {
        List<INode> path = this.getPath(target.getUuid(), conn);
        for (INode iNode : path)
        {
            if (iNode.getUuid().equals(src.getUuid()))
            {
                // TODO: throw something
            }
        }
    }
}
