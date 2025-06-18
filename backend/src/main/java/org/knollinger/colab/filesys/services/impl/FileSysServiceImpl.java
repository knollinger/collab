package org.knollinger.colab.filesys.services.impl;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.EWellknownINodeIDs;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.models.IPermissions;
import org.knollinger.colab.filesys.services.ICheckPermsService;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileSysServiceImpl implements IFileSysService
{
    private static final String SQL_GET_INODE = "" //
        + "select `name`, `parent`, `owner`, `group`, `perms`, `size`, `type`, `created`, `modified` from `inodes`" //
        + "  where `uuid`=?";

    private static final String SQL_GET_ALL_CHILDS = "" //
        + "select `name`, `uuid`, `owner`, `group`, `perms`, `size`, `type`, `created`, `modified` from `inodes`" //
        + "  where `parent`=?" //
        + "  order by `name` asc";

    private static final String SQL_CREATE_FOLDER = "" //
        + "insert into `inodes`" // 
        + "  set `uuid`=?, `parent`=?, `owner`=?, `group`=?, `perms`=?, `name`=?, `size`=?, `type`=?";

    private static final String SQL_CREATE_DOCUMENT = "" //
        + "insert into `inodes`" // 
        + "  set `uuid`=?, `parent`=?, `owner`=?, `group`=?, `perms`=?, `name`=?, `size`=?, `type`=?, data=?";

    private static final String SQL_UPDATE_INODE = "" //
        + "update `inodes`" //
        + "  set `owner`=?, `group`=?, `perms`=?" //
        + "  where `uuid`=?";

    private static final String SQL_RENAME_INODE = "" //
        + "update `inodes` set `name`=?" //
        + "  where `uuid`=?";

    private static final String SQL_GET_CHILD_BY_NAME = "" //
        + "select * from `inodes`" //
        + "  where `parent`=? and `name`=?";

    private static final String SQL_MOVE_INODE = "" //
        + "update `inodes` set `parent`=?, `name`=?" //
        + "  where `uuid`=?";

    @Autowired
    private IDbService dbService;

    @Autowired
    private ICurrentUserService currUserSvc;

    @Autowired()
    private ICheckPermsService checkPermsSvc;

    /**
     *
     */
    @Override
    public INode getINode(UUID uuid, int reqPermission)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        Connection conn = null;

        try
        {
            conn = this.dbService.openConnection();
            return this.getINode(uuid, reqPermission, conn);
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

    /**
     * private getINode-Implementierung, um den getter auch innerhalb einer DB-Transaktion 
     * verwenden zu können.
     * 
     * @param uuid
     * @param reqPermission
     * @param conn
     * @return
     * @throws SQLException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    private INode getINode(UUID uuid, int reqPermission, Connection conn)
        throws SQLException, NotFoundException, AccessDeniedException
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

            UUID owner = UUID.fromString(rs.getString("owner"));
            UUID group = UUID.fromString(rs.getString("group"));

            INode inode = INode.builder() //
                .uuid(uuid) //
                .parent(UUID.fromString(rs.getString("parent"))) //
                .owner(owner) //
                .group(group)//
                .perms(rs.getShort("perms")) //
                .name(rs.getString("name")) //
                .type(rs.getString("type")) //
                .size(rs.getLong("size")) //
                .created(rs.getTimestamp("created")) //
                .modified(rs.getTimestamp("modified")) //
                .build();
            inode.setEffectivePerms(this.checkPermsSvc.getEffectivePermissions(inode));

            this.checkPermsSvc.checkPermission(reqPermission, inode);
            return inode;
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }

    /**
     * @throws TechnicalFileSysException 
     * @throws AccessDeniedException 
     * @throws NotFoundException 
     *
     */
    @Override
    public List<INode> getAllChilds(UUID parentId, boolean foldersOnly)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<INode>();

            conn = this.dbService.openConnection();
            this.getINode(parentId, IPermissions.READ, conn); // prüft existenz und berechtigungen

            stmt = conn.prepareStatement(SQL_GET_ALL_CHILDS);
            stmt.setString(1, parentId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INode inode = INode.builder() // 
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(parentId) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group"))) //
                    .perms(rs.getShort("perms")) //
                    .name(rs.getString("name")) //
                    .type(rs.getString("type")) //
                    .size(rs.getLong("size")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
                inode.setEffectivePerms(this.checkPermsSvc.getEffectivePermissions(inode));

                if (!foldersOnly || inode.isDirectory())
                {
                    result.add(inode);
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
     * @throws AccessDeniedException 
     *
     */
    @Override
    public List<INode> getPath(UUID uuid) throws TechnicalFileSysException, NotFoundException, AccessDeniedException
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
     * Private getPath-Implementierung um den Pfad auch innerhalb einer DB-Transaktion
     * ermitteln zu können.
     * 
     * @param uuid
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    private List<INode> getPath(UUID uuid, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INode> result = new ArrayList<INode>();
            stmt = conn.prepareStatement(SQL_GET_INODE);

            this.getINode(uuid, IPermissions.READ, conn); // testet existenz und permissions

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
                        .owner(UUID.fromString(rs.getString("owner"))) //
                        .group(UUID.fromString(rs.getString("group"))) //
                        .perms(rs.getShort("perms")) //
                        .name(rs.getString("name")) //
                        .type(rs.getString("type")) //
                        .size(rs.getLong("size")) //
                        .created(rs.getTimestamp("created")) //
                        .modified(rs.getTimestamp("modified")) //
                        .build();
                    node.setEffectivePerms(this.checkPermsSvc.getEffectivePermissions(node));
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
     * @throws AccessDeniedException 
     *
     */
    @Override
    public void rename(UUID uuid, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        INode node = null;
        try
        {
            conn = this.dbService.openConnection();
            node = this.getINode(uuid, IPermissions.WRITE, conn);

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
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .group(UUID.fromString(rs.getString("group"))) //
                    .perms(rs.getShort("perms")) //
                    .name(originalFilename) //
                    .size(rs.getLong("size")) //
                    .type(rs.getString("type")) //
                    .created(rs.getTimestamp("created")) //
                    .modified(rs.getTimestamp("modified")) //
                    .build();
                result.setEffectivePerms(this.checkPermsSvc.getEffectivePermissions(result));
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
     * @throws AccessDeniedException 
     * 
     */
    @Override
    public INode createFolder(UUID parentId, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        try
        {
            conn = this.dbService.openConnection();

            this.getINode(parentId, IPermissions.WRITE, conn); // check existence and write perm for parent

            UUID uuid = UUID.randomUUID();
            TokenPayload token = this.currUserSvc.get();
            // TODO: Parent existenz und isDirectory testen

            UUID userId = token.getUser().getUserId();
            int perms = IPermissions.USR_READ | //
                IPermissions.USR_WRITE | //
                IPermissions.USR_DELETE | //
                IPermissions.GRP_READ | //
                IPermissions.GRP_WRITE | //
                IPermissions.GRP_DELETE;
            
            stmt = conn.prepareStatement(SQL_CREATE_FOLDER);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, parentId.toString());
            stmt.setString(3, userId.toString());
            stmt.setString(4, userId.toString());
            stmt.setInt(5, perms);
            stmt.setString(6, name.trim());
            stmt.setLong(7, 0);
            stmt.setString(8, "inode/directory");
            stmt.executeUpdate();

            Timestamp now = new Timestamp(System.currentTimeMillis());
            return INode.builder() //
                .uuid(uuid) //
                .parent(parentId) //
                .name(name.trim()) //
                .owner(userId) //
                .group(userId) //
                .size(0) //
                .type("inode/directory") //
                .created(now) //
                .modified(now) //
                .perms(perms) //
                .effectivePerms(IPermissions.READ | IPermissions.WRITE | IPermissions.DELETE)
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
    public INode createDocument(UUID parentId, String name, String contentType)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        String resourcePath = String.format("create-new-menu/templates/%1$s.template", contentType);
        try(InputStream in = this.getClass().getClassLoader().getResourceAsStream(resourcePath))
        {
            conn = this.dbService.openConnection();

            this.getINode(parentId, IPermissions.WRITE, conn); // check existence and write perm for parent

            UUID uuid = UUID.randomUUID();
            TokenPayload token = this.currUserSvc.get();
            UUID userId = token.getUser().getUserId();

            int perms = IPermissions.USR_READ | //
                IPermissions.USR_WRITE | //
                IPermissions.USR_DELETE | //
                IPermissions.GRP_READ | //
                IPermissions.GRP_WRITE | //
                IPermissions.GRP_DELETE;
            
            stmt = conn.prepareStatement(SQL_CREATE_DOCUMENT);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, parentId.toString());
            stmt.setString(3, userId.toString());
            stmt.setString(4, userId.toString());
            stmt.setInt(5, perms);
            stmt.setString(6, name.trim());
            stmt.setLong(7, 0);
            stmt.setString(8, contentType);
            stmt.setBinaryStream(9, in);
            stmt.executeUpdate();

            Timestamp now = new Timestamp(System.currentTimeMillis());
            return INode.builder() //
                .uuid(uuid) //
                .parent(parentId) //
                .name(name.trim()) //
                .owner(userId) //
                .group(userId) //
                .size(0) //
                .type("inode/directory") //
                .created(now) //
                .modified(now) //
                .perms(perms) //
                .effectivePerms(IPermissions.READ | IPermissions.WRITE | IPermissions.DELETE)
                .build();
        }
        catch (SQLException | IOException e)
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
     * @throws AccessDeniedException 
     *
     */
    @Override
    public void move(List<INode> src, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
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
                stmt.setString(2, iNode.getName());
                stmt.setString(3, iNode.getUuid().toString());
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
     * @throws AccessDeniedException 
     */
    private void checkMoveAllowed(INode src, INode target, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
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

    @Override
    public INode updateINode(INode inode) throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbService.openConnection();
            this.getINode(inode.getUuid(), IPermissions.WRITE, conn); // check existence and write permission of current inode

            stmt = conn.prepareStatement(SQL_UPDATE_INODE);
            stmt.setString(1, inode.getOwner().toString());
            stmt.setString(2, inode.getGroup().toString());
            stmt.setInt(3, inode.getPerms());
            stmt.setString(4, inode.getUuid().toString());
            stmt.executeUpdate();

            return this.getINode(inode.getUuid(), IPermissions.READ, conn);
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            String msg = String.format(
                "Das Dateisystem-Object `%1$s` konnte aufgrund eines technischen Problems nicht aktualisiert werden.",
                inode.getName());
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }
}
