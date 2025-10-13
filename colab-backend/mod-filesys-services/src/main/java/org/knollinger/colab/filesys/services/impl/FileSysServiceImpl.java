package org.knollinger.colab.filesys.services.impl;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.EWellknownINodeIDs;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.permissions.exceptions.TechnicalPermissionException;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileSysServiceImpl implements IFileSysService
{
    private static final String SQL_GET_ALL_CHILDS = "" //
        + "select `i`.`name`, `i`.`uuid`, `i`.`linkTo`, `i`.`owner`, `i`.`parent`, `i`.`group`, `i`.`size`, `i`.`type`, `i`.`created`, `i`.`modified`, `p`.`ownerId`, `p`.`ownerType`, `p`.`perms`" //
        + "  from `inodes` i " //
        + "  left join `permissions` p" //
        + "    on `i`.`uuid` = `p`.`resourceId`" //
        + "  where `i`.`parent`=?" //
        + "  order by `i`.`name`, `i`.`uuid` asc";

    private static final String SQL_GET_INODE = "" //
        + "select `i`.`name`, `i`.`parent`, `i`.`linkTo`, `i`.`owner`, `i`.`group`, `i`.`size`, `i`.`type`, `i`.`created`, `i`.`modified`, `p`.`ownerId`, `p`.`ownerType`, `p`.`perms` " //
        + "  from `inodes` i " //
        + "  left join `permissions` p" //
        + "    on `i`.`uuid` = `p`.`resourceId`" //
        + "  where `i`.`uuid`=?";

    private static final String SQL_CREATE_DOCUMENT = "" //
        + "insert into `inodes`" // 
        + "  set `uuid`=?, `parent`=?, `owner`=?, `group`=?, `name`=?, `size`=?, `type`=?, data=?";

    private static final String SQL_UPDATE_INODE = "" //
        + "update `inodes`" //
        + "  set `owner`=?, `group`=?" //
        + "  where `uuid`=?";

    private static final String SQL_RENAME_INODE = "" //
        + "update `inodes` set `name`=?" //
        + "  where `uuid`=?";

    private static final String SQL_GET_CHILD_BY_NAME = "" //
        + "select uuid from `inodes`" //
        + "  where `parent`=? and `name`=?";

    private static final String SQL_MOVE_INODE = "" //
        + "update `inodes` set `parent`=?, `name`=?" //
        + "  where `uuid`=?";

    @Autowired()
    private IDbService dbService;

    @Autowired()
    private IPermissionsService permsSvc;

    @Autowired()
    private ICurrentUserService currUserSvc;
    
    /**
     *
     */
    @Override
    public INode getINode(UUID uuid)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            return this.getINode(uuid, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Die INode mit der UUID '%1$s' konnte nicht geladen werden", uuid);
            throw new TechnicalFileSysException(msg, e);
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
     * @throws NotFoundException
     * @throws AccessDeniedException 
     * @throws TechnicalFileSysException 
     */
    public INode getINode(UUID uuid, Connection conn)
        throws NotFoundException, AccessDeniedException, TechnicalFileSysException
    {
        ResultSet rs = null;

        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_INODE))
        {
            boolean found = false;
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();

            INode.INodeBuilder nodeBuilder = INode.builder();
            ACL.ACLBuilder aclBuilder = ACL.builder();
            List<ACLEntry> aclEntries = new ArrayList<>();

            while (rs.next())
            {
                if (!found)
                {
                    nodeBuilder //
                        .uuid(uuid) //
                        .parent(UUID.fromString(rs.getString("i.parent"))) //
                        .linkTo(this.parseNullableUUID(rs.getString("i.linkTo"))) //
                        .owner(UUID.fromString(rs.getString("i.owner"))) //
                        .group(UUID.fromString(rs.getString("i.group")))//
                        .name(rs.getString("i.name")) //
                        .type(rs.getString("i.type")) //
                        .size(rs.getLong("i.size")) //
                        .created(rs.getTimestamp("i.created")) //
                        .modified(rs.getTimestamp("i.modified"));

                    aclBuilder //
                        .ownerId(UUID.fromString(rs.getString("i.owner"))) //
                        .groupId(UUID.fromString(rs.getString("i.group")));

                    found = true;
                }

                ACLEntry entry = ACLEntry.builder() //
                    .uuid(UUID.fromString(rs.getString("p.ownerId"))) //
                    .type(EACLEntryType.valueOf(rs.getString("p.ownerType"))) //
                    .perms(rs.getInt("p.perms")) //
                    .build();
                aclEntries.add(entry);
            }

            if (!found)
            {
                throw new NotFoundException(uuid);
            }

            aclBuilder.entries(aclEntries);
            nodeBuilder.acl(aclBuilder.build());
            INode result = nodeBuilder.build();

            if (result.isLink())
            {
                result = this.getINode(result.getLinkTo(), conn);
            }
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format("Die INode mit der UUID '%1$s' konnte nicht geladen werden", uuid);
            throw new TechnicalFileSysException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
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
        try (Connection conn = this.dbService.openConnection())
        {
            return this.getAllChilds(parentId,  foldersOnly, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Die Elemente des Ordners mit der UUID '%1$s' konnten nicht geladen werden",
                parentId);
            throw new TechnicalFileSysException(msg, e);
        }
    }


    /**
     * @throws TechnicalFileSysException 
     * @throws AccessDeniedException 
     * @throws NotFoundException 
     *
     */
    @Override
    public List<INode> getAllChilds(UUID parentId, boolean foldersOnly, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        ResultSet rs = null;

        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_ALL_CHILDS))
        {

            List<INode> result = new ArrayList<INode>();

            List<ACLEntry> aclEntries = new ArrayList<>();
            ACL.ACLBuilder currACLBuilder = null;
            INode.INodeBuilder currNodeBuilder = null;
            UUID currUUID = null;

            stmt.setString(1, parentId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                UUID uuid = UUID.fromString(rs.getString("i.uuid"));
                if (currUUID == null || !uuid.equals(currUUID))
                {
                    if (currUUID != null)
                    {
                        currACLBuilder.entries(aclEntries);
                        aclEntries = new ArrayList<>();
                        currNodeBuilder.acl(currACLBuilder.build());
                        INode node = currNodeBuilder.build();
                        if (!foldersOnly || node.isDirectory())
                        {
                            result.add(currNodeBuilder.build());
                        }
                    }
                    currUUID = uuid;
                    currNodeBuilder = INode.builder();
                    currACLBuilder = ACL.builder();

                    currNodeBuilder.uuid(uuid) //
                        .parent(parentId) //
                        .linkTo(this.parseNullableUUID(rs.getString("linkTo"))) //
                        .owner(UUID.fromString(rs.getString("i.owner"))) //
                        .group(UUID.fromString(rs.getString("i.group"))) //
                        .name(rs.getString("i.name")) //
                        .type(rs.getString("i.type")) //
                        .size(rs.getLong("i.size")) //
                        .created(rs.getTimestamp("i.created")) //
                        .modified(rs.getTimestamp("i.modified"));

                    currACLBuilder//
                        .ownerId(UUID.fromString(rs.getString("i.owner"))) //
                        .groupId(UUID.fromString(rs.getString("i.group")));
                }

                ACLEntry entry = ACLEntry.builder() //
                    .uuid(UUID.fromString(rs.getString("p.ownerId"))) //
                    .type(EACLEntryType.valueOf(rs.getString("p.ownerType"))) //
                    .perms(rs.getInt("p.perms")) //
                    .build();
                aclEntries.add(entry);
            }

            if (currNodeBuilder != null)
            {
                currACLBuilder.entries(aclEntries);
                currNodeBuilder.acl(currACLBuilder.build());
                INode node = currNodeBuilder.build();
                if (!foldersOnly || node.isDirectory())
                {
                    result.add(currNodeBuilder.build());
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

        try (Connection conn = this.dbService.openConnection())
        {
            return this.getPath(uuid, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Pfad zum Object mit der UUID '%1$s' konnte nicht ermittelt werden", uuid);
            throw new TechnicalFileSysException(msg, e);
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
        List<INode> result = new ArrayList<INode>();

        UUID currentUUID = uuid;
        while (!currentUUID.equals(EWellknownINodeIDs.NONE.value()))
        {
            INode node = this.getINode(currentUUID, conn);
            result.add(0, node);
            currentUUID = node.getParent();
        }
        return result;
    }
    /**
     * @throws AccessDeniedException 
     * @throws NotFoundException 
     * @throws TechnicalFileSysException 
     *
     */
    public INode getChildByName(UUID parentId, String name)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            return this.getChildByName(parentId, name, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Das Dateisystem-Objekt konnte nicht geladen werden.", e);
        }
    }

    /**
     * 
     * @param parentId
     * @param name
     * @param conn
     * @return
     * @throws AccessDeniedException 
     * @throws NotFoundException 
     * @throws TechnicalFileSysException 
     */
    public INode getChildByName(UUID parentId, String name, Connection conn)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException
    {
        ResultSet rs = null;

        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_CHILD_BY_NAME))
        {

            stmt.setString(1, parentId.toString());
            stmt.setString(2, name);
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new NotFoundException(name);
            }

            UUID uuid = UUID.fromString(rs.getString("uuid"));
            return this.getINode(uuid, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Das Dateisystem-Objekt konnte nicht geladen werden.", e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
        }
    }

    /**
     *
     */
    @Override
    public INode createFolder(UUID parentId, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            conn.setAutoCommit(false);
            INode result = this.createFolder(parentId, name, conn);
            conn.commit();
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Ordner '%1$s' konnte nicht angelegt werden", e);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     * @throws AccessDeniedException 
     * 
     */
    @Override
    public INode createFolder(UUID parentId, String name, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        return this.createDocument(parentId, name, "inode/directory", conn);
    }

    /**
     * @param val
     * @return
     */
    private UUID parseNullableUUID(String val)
    {

        UUID result = null;
        if (val != null)
        {
            result = UUID.fromString(val);
        }
        return result;
    }

    /**
    *
    */
    @Override
    public INode createDocument(UUID parentId, String name, String contentType)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            conn.setAutoCommit(false);
            INode inode = this.createDocument(parentId, name, contentType, conn);
            conn.commit();
            return inode;
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Ordner '%1$s' konnte nicht angelegt werden", e);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     *
     */
    @Override
    public INode createDocument(UUID parentId, String name, String contentType, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        String resourcePath = String.format("create-new-menu/templates/%1$s.template", contentType);

        try (PreparedStatement stmt = conn.prepareStatement(SQL_CREATE_DOCUMENT);
            InputStream in = this.getClass().getClassLoader().getResourceAsStream(resourcePath))
        {
            UUID uuid = UUID.randomUUID();
            UUID userId = this.currUserSvc.getUser().getUserId();

            stmt.setString(1, uuid.toString());
            stmt.setString(2, parentId.toString());
            stmt.setString(3, userId.toString());
            stmt.setString(4, userId.toString());
            stmt.setString(5, name.trim());
            stmt.setLong(6, 0);
            stmt.setString(7, contentType);
            stmt.setBinaryStream(8, in);
            stmt.executeUpdate();

            this.permsSvc.createACLEntry(uuid, userId, EACLEntryType.USER, ACLEntry.PERM_ALL);
            this.permsSvc.createACLEntry(uuid, userId, EACLEntryType.GROUP, ACLEntry.PERM_ALL);

            return this.getINode(uuid, conn);
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateEntryException(this.getChildByName(parentId, name, conn));
        }
        catch (SQLException | IOException | TechnicalPermissionException e)
        {
            e.printStackTrace();
            String msg = String.format("Der Ordner '%1$s' konnte nicht angelegt werden", name, e);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     *
     */
    @Override
    public void rename(UUID uuid, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            this.rename(uuid, name, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Das Dateisystem-Objekt mit der UUID '%1$s' konnte nicht umbenannt werden",
                uuid);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     *
     */
    @Override
    public void rename(UUID uuid, String name, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        INode node = null;
        try (PreparedStatement stmt = conn.prepareStatement(SQL_RENAME_INODE))
        {
            node = this.getINode(uuid, conn);
            stmt.setString(1, name);
            stmt.setString(2, uuid.toString());
            stmt.executeUpdate();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            node = this.getChildByName(node.getParent(), name, conn);
            throw new DuplicateEntryException(node);
        }
        catch (SQLException e)
        {
            String msg = String.format("Das Dateisystem-Objekt mit der UUID '%1$s' konnte nicht umbenannt werden",
                uuid);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     * @throws AccessDeniedException 
     */
    @Override
    public void move(List<INode> src, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            conn.setAutoCommit(false);
            this.move(src, target, conn);
            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(
                "Das verschieben des Objektes konnte aufgrund eines technischen Fehlers nicht durchgeführt werden.", e);
        }
    }

    /**
     * @throws AccessDeniedException 
     */
    @Override
    public void move(List<INode> src, INode target, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException
    {
        // TODO testen, ob das objekt nicht in eines seiner kinder verschoben werden soll
        // Dazu getPath (target), die src darf nicht darin enthalten sein!

        try (PreparedStatement stmt = conn.prepareStatement(SQL_MOVE_INODE);)
        {
            for (INode iNode : src)
            {
                this.checkMoveAllowed(iNode, target, conn);

                stmt.setString(1, target.getUuid().toString());
                stmt.setString(2, iNode.getName());
                stmt.setString(3, iNode.getUuid().toString());
                if (stmt.executeUpdate() == 0)
                {
                    throw new NotFoundException(iNode.getUuid());
                }
            }
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

    /**
     *
     */
    @Override
    public INode updateINode(INode inode) throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            conn.setAutoCommit(false);
            INode result = this.updateINode(inode, conn);
            conn.commit();
            return result;
        }
        catch (SQLException e)
        {
            String msg = String.format(
                "Das Dateisystem-Object `%1$s` konnte aufgrund eines technischen Problems nicht aktualisiert werden.",
                inode.getName());
            throw new TechnicalFileSysException(msg, e);
        }
    }


    /**
     *
     */
    @Override
    public INode updateINode(INode inode, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_UPDATE_INODE);)
        {
            stmt.setString(1, inode.getOwner().toString());
            stmt.setString(2, inode.getGroup().toString());
            stmt.setString(3, inode.getUuid().toString());
            stmt.executeUpdate();

            this.permsSvc.replaceACLEntries(inode.getUuid(), inode.getAcl().getEntries(), conn);
            return this.getINode(inode.getUuid(), conn);
        }
        catch (SQLException | TechnicalPermissionException e)
        {
            String msg = String.format(
                "Das Dateisystem-Object `%1$s` konnte aufgrund eines technischen Problems nicht aktualisiert werden.",
                inode.getName());
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     * @param parentId
     * @param name
     * @return
     * @throws AccessDeniedException
     * @throws NotFoundException
     * @throws TechnicalFileSysException
     * @throws DuplicateEntryException
     */
    @Override
    public INode getOrCreateFolder(UUID parentId, String name)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException, DuplicateEntryException
    {
        try (Connection conn = this.dbService.openConnection())
        {
            return this.getOrCreateFolder(parentId, name, conn);
        }
        catch (SQLException e)
        {
            String msg = String.format("Die existenz des Ordners '%1$s' konnte nicht sicher gestellt werden.", name);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     * @param parentId
     * @param name
     * @param conn
     * @return
     * @throws AccessDeniedException
     * @throws NotFoundException
     * @throws TechnicalFileSysException
     * @throws DuplicateEntryException
     */
    @Override
    public INode getOrCreateFolder(UUID parentId, String name, Connection conn)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException, DuplicateEntryException
    {
        INode result = INode.empty();
        try
        {
            result = this.createFolder(parentId, name, conn);
        }
        catch (DuplicateEntryException e)
        {
            result = this.getChildByName(parentId, name, conn);
            if (!result.isDirectory())
            {
                throw e;
            }
        }
        return result;
    }
}
