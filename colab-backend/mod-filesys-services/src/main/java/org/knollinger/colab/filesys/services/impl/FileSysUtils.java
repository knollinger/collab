package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;

class FileSysUtils
{
    private static final String SQL_GET_INODE = """
            select `i`.`name`, `i`.`parent`, `i`.`linkTo`, `i`.`size`, `i`.`type`, `i`.`created`, `i`.`modified`, `a`.`ownerId`, `a`.`groupId`, `e`.`ownerId`, `e`.`ownerType`, `e`.`perms`
              from `inodes` i
                left join `acls` a
                  on `i`.`uuid` = `a`.`resourceId`
                left join `acl_entries` e
                  on `i`.`uuid` = `e`.`resourceId`
              where `i`.`uuid`=?
        """;

    private static final String SQL_RESOLVE_LINK = """
        select `linkTo` from `inodes`
            where `uuid`=?
        """;

    private static final String SQL_GET_CHILD_BY_NAME = """
        select uuid from `inodes`
          where `parent`=? and `name`=?
        """;

    /**
     * @param uuid
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    public INode getINode(UUID uuid, Connection conn) throws TechnicalFileSysException, NotFoundException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_INODE))
        {
            boolean found = false;
            stmt.setString(1, uuid.toString());
            try (ResultSet rs = stmt.executeQuery())
            {

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
                            .name(rs.getString("i.name")) //
                            .type(rs.getString("i.type")) //
                            .size(rs.getLong("i.size")) //
                            .created(rs.getTimestamp("i.created")) //
                            .modified(rs.getTimestamp("i.modified"));

                        aclBuilder //
                            .ownerId(UUID.fromString(rs.getString("a.ownerId"))) //
                            .groupId(UUID.fromString(rs.getString("a.groupId")));

                        found = true;
                    }

                    ACLEntry entry = ACLEntry.builder() //
                        .uuid(UUID.fromString(rs.getString("e.ownerId"))) //
                        .type(EACLEntryType.valueOf(rs.getString("e.ownerType"))) //
                        .perms(rs.getInt("e.perms")) //
                        .build();
                    aclEntries.add(entry);
                }


                if (!found)
                {
                    throw new NotFoundException(uuid);
                }

                aclBuilder.entries(aclEntries);
                nodeBuilder.acl(aclBuilder.build());
                return nodeBuilder.build();
            }
        }
        catch (SQLException e)
        {
            String msg = String.format("Die INode mit der UUID '%1$s' konnte nicht geladen werden", uuid);
            throw new TechnicalFileSysException(msg, e);
        }
    }

    /**
     * Löse einen Link auf
     * @param uuid
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException
     */
    public UUID resolveLink(UUID uuid, Connection conn) throws TechnicalFileSysException, NotFoundException
    {
        UUID result = uuid;

        try (PreparedStatement stmt = conn.prepareStatement(SQL_RESOLVE_LINK))
        {
            stmt.setString(1, uuid.toString());
            try (ResultSet rs = stmt.executeQuery())
            {
                if (!rs.next())
                {
                    throw new NotFoundException(uuid);
                }

                String linkTo = rs.getString("linkTo");
                if (linkTo != null)
                {
                    result = this.resolveLink(UUID.fromString(linkTo), conn); // Just another Link, follow them
                }
                return result;
            }
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Der Dateisystem-Link konnte nicht aufgelöst werden.", e);
        }
    }

    public INode getChildByName(UUID parentId, String name, Connection conn)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException
    {
        // TODO: ACL und die Entries mit lesen
        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_CHILD_BY_NAME))
        {

            stmt.setString(1, parentId.toString());
            stmt.setString(2, name);
            try (ResultSet rs = stmt.executeQuery())
            {
                if (!rs.next())
                {
                    throw new NotFoundException(name);
                }

                UUID uuid = UUID.fromString(rs.getString("uuid"));
                return this.getINode(uuid, conn);
            }
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException("Das Dateisystem-Objekt konnte nicht geladen werden.", e);
        }
    }

    /**
     * Parse eine UUID aus einem String. Wemm der EIngabewert null ist, so wird auch null geliefert.
     * @param val
     * @return
     */
    public UUID parseNullableUUID(String val)
    {

        UUID result = null;
        if (val != null)
        {
            result = UUID.fromString(val);
        }
        return result;
    }
}
