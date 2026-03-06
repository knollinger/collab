package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.services.IDeleteService;
import org.knollinger.colab.permissions.exceptions.TechnicalACLException;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Die DeleteServiceImpl implementiert die Services zum löschen von INodes.
 * 
 * Löschen ist nicht ganz trivial. 
 * <ul>
 * <li>
 * Das zu löschende Objekt kann ein Folder sein, dann müssen auch alle
 * Kinder und ggf deren Kindes-Kinder gelöscht werden.
 * </li>
 * <li>
 * Auf die zu löschenden Objekte können Links bestehen. Und auf diese wiederum Links.
 * </li>
 * </ul>
 * 
 * <p>
 * Und dann schlägt natürlich noch das Berechtigungs-Thema zu.
 * </p>
 * <p>
 * Für alle übergebenen UUIDs sammeln wir erst einmal die UUIDs aller Kinder, Kindes-Kinder usw.
 * Im Anschluss wwerden für alle diese UUIDs bestehende Links (und Links auf solche Links....ad infinitum)
 * gesucht und zur Liste der zu löschenden Elemente angefügt.
 * </p>
 * Und wenn diese Orgie durch ist, dann wird gelöscht.
 */
@Service
public class DeleteServiceImpl implements IDeleteService
{
    private static final String SQL_GET_CHILDS = "" //
        + "select `uuid`, `type` from `inodes`" //
        + "  where `parent`=?";

    private static final String SQL_GET_LINKS = "" //
        + "select `uuid` from `inodes`" //
        + "  where `linkTo`=?";

    private static final String SQL_DELETE_INODE = "" //
        + "delete from `inodes`" //
        + "  where `uuid`=?";

    private static final String SQL_DELETE_THUMB = "" //
        + "delete from `thumbnails`" //
        + "  where `uuid`=?";

    private static final String ERR_DELETE_INODE = "Das Datei-System Objekt konnte aufgrund eines technischen Problems nicht gelöscht werden.";

    @Autowired
    private IDbService dbSvc;

    @Autowired
    private IPermissionsService permsSvc;

    /**
     *
     */
    @Override
    public Collection<UUID> deleteINode(UUID uuid) throws TechnicalFileSysException, NotFoundException
    {
        return this.deleteINodes(List.of(uuid));
    }

    /**
     *
     */
    @Override
    public Collection<UUID> deleteINode(UUID uuid, Connection conn) throws TechnicalFileSysException, NotFoundException
    {
        return this.deleteINodes(List.of(uuid), conn);
    }

    /**
     *
     */
    @Override
    public Collection<UUID> deleteINodes(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);

            Collection<UUID> deleted = this.deleteINodes(uuids, conn);
            conn.commit();
            
            return deleted;
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(ERR_DELETE_INODE);
        }
    }

    /**
     * Lösche die INode
     * 
     * Dazu muss zuerst die ACL gelöscht werden und ein ggf existierendes Thumbnail da sonst 
     * foreignkey-constraints verletzt werden.
     */
    @Override
    public Collection<UUID> deleteINodes(List<UUID> uuids, Connection conn) throws TechnicalFileSysException, NotFoundException
    {
        try
        {
            Set<UUID> toDelete = new HashSet<>();
            for (UUID uuid : uuids)
            {
                toDelete.addAll(this.collectChildNodes(uuid, conn));
            }
            toDelete.addAll(this.collectLinks(toDelete, conn));

            try (PreparedStatement inodeStmt = conn.prepareStatement(SQL_DELETE_INODE);
                PreparedStatement thumbsStmt = conn.prepareStatement(SQL_DELETE_THUMB))
            {
                for (UUID id : toDelete)
                {
                    this.permsSvc.deleteACL(id, conn);

                    thumbsStmt.setString(1, id.toString());
                    thumbsStmt.executeUpdate();

                    inodeStmt.setString(1, id.toString());
                    inodeStmt.executeUpdate();
                }
            }
            return toDelete;
        }
        catch (SQLException | TechnicalACLException e)
        {
            throw new TechnicalFileSysException(ERR_DELETE_INODE, e);
        }
    }

    /**
     * Finde die Childs der gegebenen INode. Das ganze wird rekursiv durchgeführt, so dass
     * auch die Kinder der Kinder... gefunden werden.
     * 
     * @param parentId
     * @param conn
     * @return
     * @throws SQLException
     */
    private Set<UUID> collectChildNodes(UUID parentId, Connection conn) throws SQLException
    {
        Set<UUID> result = new HashSet<>();
        result.add(parentId);

        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_CHILDS))
        {
            stmt.setString(1, parentId.toString());
            try (ResultSet rs = stmt.executeQuery())
            {
                while (rs.next())
                {
                    UUID uuid = UUID.fromString(rs.getString("uuid"));
                    result.add(uuid);

                    if (rs.getString("type").toLowerCase().startsWith("inode/directory"))
                    {
                        result.addAll(this.collectChildNodes(uuid, conn));
                    }
                }
            }
        }
        return result;
    }

    /**
     * Sammle die UUIDs aller INodes, welche Links auf die INodes in der übergebenen Liste
     * darstellen. Das ganze wird rekursiv durchgeführt, so dass auch Link auf Link auf Link...
     * gefunden wird.
     * 
     * @param targets
     * @param conn
     * @return
     * @throws SQLException
     */
    private Set<UUID> collectLinks(Set<UUID> targets, Connection conn) throws SQLException
    {
        Set<UUID> links = new HashSet<>();
        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_LINKS))
        {
            for (UUID target : targets)
            {
                stmt.setString(1, target.toString());
                try (ResultSet rs = stmt.executeQuery())
                {
                    while (rs.next())
                    {
                        links.add(UUID.fromString(rs.getString("uuid")));
                    }
                }
            }
        }

        if (!links.isEmpty())
        {
            Set<UUID> linkToLink = this.collectLinks(links, conn);
            links.addAll(linkToLink);
        }
        return links;

    }
}
