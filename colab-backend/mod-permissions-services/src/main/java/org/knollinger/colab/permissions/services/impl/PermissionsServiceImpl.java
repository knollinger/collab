package org.knollinger.colab.permissions.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.knollinger.colab.permissions.exceptions.ACLNotFoundException;
import org.knollinger.colab.permissions.exceptions.DuplicateACLException;
import org.knollinger.colab.permissions.exceptions.TechnicalACLException;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PermissionsServiceImpl implements IPermissionsService
{
    private static final String SQL_CREATE_ACL = "" //
        + "insert into acls set resourceId=?, ownerId=?, groupId=?";

    private static final String SQL_CREATE_ACL_ENTRY = "" //
        + "insert into acl_entries" //
        + "  set resourceId=?, ownerId=?, ownerType=?, perms=?";

    private static final String SQL_GET_ACL = null; // TODO: not yet implemented

    private static final String SQL_COPY_ACL = "" //
        + "insert into acls (resourceId, ownerId, groupId)" //
        + "  select ?, ownerId, groupId from acls" //
        + "    where resourceId=?";

    private static final String SQL_COPY_ACL_ENTRIES = "" //
        + "insert into acl_entries (resourceId, ownerId, ownerType, perms)" //
        + "  select ?, ownerId, ownerType, perms from acl_entries" //
        + "    where resourceId=?";

    private static final String SQL_DELETE_ACL = "" //
        + "delete from `acls` " //
        + "  where resourceId=?";

    private static final String SQL_DELETE_ACL_ENTRIES = "" //
        + "delete from `acl_entries` " //
        + "  where resourceId=?";

    @Autowired()
    private ICurrentUserService currUserSvc;

    @Autowired()
    private IDbService dbSvc;

    /**
     * @throws DuplicateACLException 
     *
     */
    @Override
    public void createACL(UUID resourceId, ACL acl) throws TechnicalACLException, DuplicateACLException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);
            this.createACL(resourceId, acl, conn);
            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId, e);
        }
    }

    @Override
    public void createACL(UUID resourceId, ACL acl, Connection conn) throws TechnicalACLException, DuplicateACLException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_CREATE_ACL))
        {
            stmt.setString(1, resourceId.toString());
            stmt.setString(2, acl.getOwnerId().toString());
            stmt.setString(3, acl.getGroupId().toString());
            stmt.executeUpdate();

            for (ACLEntry entry : acl.getEntries())
            {
                this.createACLEntry(resourceId, entry.getUuid(), entry.getType(), entry.getPerms(), conn);
            }
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateACLException(resourceId);
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId, e);
        }

    }

    /**
     * 
     */
    @Override
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms) throws TechnicalACLException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            this.createACLEntry(resId, ownerId, type, perms, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resId, e);
        }
    }

    private void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms, Connection conn)
        throws TechnicalACLException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_CREATE_ACL_ENTRY))
        {
            stmt.setString(1, resId.toString());
            stmt.setString(2, ownerId.toString());
            stmt.setString(3, type.name());
            stmt.setInt(4, ACLEntry.normalizePermissions(perms));
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resId, e);
        }
    }

    /**
     * @param resourceId
     * @return
     * @throws TechnicalACLException
     * @throws ACLNotFoundException
     */
    @Override
    public ACL getACL(UUID resourceId) throws TechnicalACLException, ACLNotFoundException
    {

        try (Connection conn = this.dbSvc.openConnection())
        {
            return this.getACL(resourceId, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId);
        }
    }

    /**
     * @param resourceId
     * @param conn
     * @return
     * @throws TechnicalACLException
     * @throws ACLNotFoundException
     */
    @Override
    public ACL getACL(UUID resourceId, Connection conn) throws TechnicalACLException, ACLNotFoundException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_ACL))
        {
            List<ACLEntry> entries = new ArrayList<>();
            String ownerId = null;
            String groupId = null;
            boolean found = false;

            stmt.setString(1, resourceId.toString());
            ResultSet rs = stmt.executeQuery();
            while (rs.next())
            {
                ownerId = rs.getString("ownerId");
                groupId = rs.getString("ownerId");
                ACLEntry entry = ACLEntry.builder() //
                    .uuid(UUID.fromString(rs.getString("ownerId"))) //
                    .type(EACLEntryType.valueOf(rs.getString("ownerType"))) //
                    .perms(rs.getInt("perms")).build();
                entries.add(entry);
                found = true;
            }

            if (!found)
            {
                throw new ACLNotFoundException(resourceId);
            }

            return ACL.builder() //
                .ownerId(UUID.fromString(ownerId)) //
                .groupId(UUID.fromString(groupId)) //
                .entries(entries) //
                .build();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId);
        }
    }

    /**
     *
     */
    public ACL updateACL(UUID resourceId, ACL acl) throws TechnicalACLException, ACLNotFoundException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            return this.updateACL(resourceId, acl, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId);
        }
    }

    /**
     *
     */
    public ACL updateACL(UUID resourceId, ACL acl, Connection conn) throws TechnicalACLException, ACLNotFoundException
    {
        try
        {
            this.deleteACL(resourceId, conn);
            this.createACL(resourceId, acl, conn);
        }
        catch (DuplicateACLException e)
        {
            // can't occur
        }
        return acl;
    }

    /**
     *
     */
    public void copyACL(UUID srcUUID, UUID targetUUID) throws TechnicalACLException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);
            this.copyACL(srcUUID, targetUUID, conn);
            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(srcUUID, e);
        }
    }

    public void copyACL(UUID srcResourceId, UUID targetResourceId, Connection conn) throws TechnicalACLException
    {
        this.deleteACL(targetResourceId, conn);
        try (PreparedStatement stmt = conn.prepareStatement(SQL_COPY_ACL))
        {

            stmt.setString(1, targetResourceId.toString());
            stmt.setString(2, srcResourceId.toString());
            stmt.executeUpdate();

            this.copyACLEntries(srcResourceId, targetResourceId, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(srcResourceId, e);
        }
    }

    public void copyACLEntries(UUID srcResourceId, UUID targetResourceId, Connection conn) throws TechnicalACLException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_COPY_ACL_ENTRIES))
        {
            stmt.setString(1, targetResourceId.toString());
            stmt.setString(2, srcResourceId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(srcResourceId, e);
        }
    }

    @Override
    public void deleteACL(UUID resourceId) throws TechnicalACLException
    {

        try (Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);
            this.deleteACL(resourceId, conn);
            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId, e);
        }
    }

    @Override
    public void deleteACL(UUID resourceId, Connection conn) throws TechnicalACLException
    {
        this.deleteACLEntries(resourceId, conn);
        try (PreparedStatement stmt = conn.prepareStatement(SQL_DELETE_ACL))
        {
            stmt.setString(1, resourceId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId, e);
        }
    }

    /**
     * @param resourceId
     * @param conn
     * @throws TechnicalACLException
     */
    private void deleteACLEntries(UUID resourceId, Connection conn) throws TechnicalACLException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_DELETE_ACL_ENTRIES))
        {
            stmt.setString(1, resourceId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalACLException(resourceId, e);
        }
    }

    @Override
    public int getEffectivePermissions(ACL acl)
    {
        int perms = ACLEntry.PERM_NONE;

        // zuerst werden die UUIDs aller Gruppen des Benutzers und seine eigene UUID
        // in ein Set gepackt. Dadurch werden schon mal dubletten (user-uuid und uuid 
        // der Benutzergruppe sind gleich!) eleminiert.
        Set<UUID> allUUIDs = new HashSet<>();
        allUUIDs.add(this.currUserSvc.getUser().getUserId());
        this.currUserSvc.getGroups().forEach(group -> allUUIDs.add(group.getUuid()));

        // Für jeden Eintrag in der ACL wird geprüft, ob die UUID des Entries im oben
        // konstruierten Set enthalten ist. Sollte dies der Fall sein, so werden die 
        // Permissions des Entries zu den effektiven Permissions hinzu gefügt.
        for (ACLEntry entry : acl.getEntries())
        {
            if (allUUIDs.contains(entry.getUuid()))
            {
                perms |= entry.getPerms();
            }
        } ;
        return ACLEntry.normalizePermissions(perms);
    }

    @Override
    public boolean canEffectiveRead(ACL acl)
    {
        return (this.getEffectivePermissions(acl) & ACLEntry.PERM_READ) == ACLEntry.PERM_READ;
    }

    @Override
    public boolean canEffectiveWrite(ACL acl)
    {
        return (this.getEffectivePermissions(acl) & ACLEntry.PERM_WRITE) == ACLEntry.PERM_WRITE;
    }

    @Override
    public boolean canEffectiveDelete(ACL acl)
    {
        return (this.getEffectivePermissions(acl) & ACLEntry.PERM_DELETE) == ACLEntry.PERM_DELETE;
    }
}
