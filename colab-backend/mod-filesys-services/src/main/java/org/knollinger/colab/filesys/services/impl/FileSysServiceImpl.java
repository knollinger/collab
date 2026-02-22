package org.knollinger.colab.filesys.services.impl;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
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
import org.knollinger.colab.permissions.exceptions.DuplicateACLException;
import org.knollinger.colab.permissions.exceptions.TechnicalACLException;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileSysServiceImpl implements IFileSysService
{
    private static final String SQL_CREATE_DOCUMENT = "" //
        + "insert into `inodes`" // 
        + "  set `uuid`=?, `parent`=?, `name`=?, `size`=?, `type`=?, data=?";

    private static final String SQL_RENAME_INODE = "" //
        + "update `inodes` set `name`=?" //
        + "  where `uuid`=?";

    @Autowired()
    private IDbService dbService;

    @Autowired()
    private IPermissionsService permsSvc;

    @Autowired()
    private ICurrentUserService currUserSvc;
    
    private FileSysUtils fileSysUtils = new FileSysUtils();

    /**
     *
     */
    @Override
    public INode getINode(UUID uuid) throws TechnicalFileSysException, NotFoundException, AccessDeniedException
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
        return this.fileSysUtils.getINode(uuid, conn);
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
            return this.fileSysUtils.getChildByName(parentId, name, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Das Dateisystem-Objekt konnte nicht geladen werden.", e);
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
            stmt.setString(3, name.trim());
            stmt.setLong(4, 0);
            stmt.setString(5, contentType);
            stmt.setBinaryStream(6, in);
            stmt.executeUpdate();

            ACL acl = ACL.createOwnerACL(userId);
            this.permsSvc.createACL(uuid, acl, conn);

            return this.getINode(uuid, conn);
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateEntryException(this.fileSysUtils.getChildByName(parentId, name, conn));
        }
        catch (SQLException | IOException | TechnicalACLException | DuplicateACLException e)
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
            node = this.fileSysUtils.getChildByName(node.getParent(), name, conn);
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
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException
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
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException
    {
        INode result = INode.empty();
        try
        {
            result = this.createFolder(parentId, name, conn);
        }
        catch (DuplicateEntryException e)
        {
            result = this.fileSysUtils.getChildByName(parentId, name, conn);
            if (!result.isDirectory())
            {
                throw new NotFoundException(name);
            }
        }
        return result;
    }
}
