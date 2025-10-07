package org.knollinger.colab.permissions.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

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
public class PermissionsServiceImpl implements IPermissionsService
{
    private static final String SQL_CREATE_ACL_ENTRY = "" //
        + "insert into permissions" //
        + "  set resourceId=?, ownerId=?, ownerType=?, perms=?";

    private static final String SQL_DELETE_ACL = "" //
        + "delete from permissions" //
        + "  where resourceId=?";

    private static final String SQL_COPY_ACL_ENTRIES = "" //
        + "insert into permissions (resourceId, ownerId, ownerType, perms)" //
        + "  select ?, ownerId, ownerType, perms from permissions" //
        + "    where resourceId=?";

    @Autowired()
    private ICurrentUserService currUserSvc;

    @Autowired()
    private IDbService dbSvc;

    /**
     * 
     */
    @Override
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms)
        throws TechnicalPermissionException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            this.createACLEntry(resId, ownerId, type, perms, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to create acl entry", e);
        }
    }

    @Override
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms, Connection conn)
        throws TechnicalPermissionException
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
            throw new TechnicalPermissionException("unable to create acl entry", e);
        }
    }

    @Override
    public void deleteACLEntries(UUID resId) throws TechnicalPermissionException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            this.deleteACLEntries(resId, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to delete acl entries", e);
        }
    }

    @Override
    public void deleteACLEntries(UUID resId, Connection conn) throws TechnicalPermissionException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_DELETE_ACL))
        {
            stmt.setString(1, resId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to delete acl entries", e);
        }
    }

    @Override
    public void replaceACLEntries(UUID resId, List<ACLEntry> entries) throws TechnicalPermissionException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            conn.setAutoCommit(false);
            this.replaceACLEntries(resId, entries, conn);
            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to delete acl entries", e);
        }
    }

    @Override
    public void replaceACLEntries(UUID resId, List<ACLEntry> entries, Connection conn)
        throws TechnicalPermissionException
    {
        this.deleteACLEntries(resId, conn);

        for (ACLEntry entry : entries)
        {
            this.createACLEntry(resId, entry.getUuid(), entry.getType(), entry.getPerms(), conn);
        } ;
    }


    @Override
    public void copyACLEntries(UUID srcResourceId, UUID targetResourceId) throws TechnicalPermissionException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            this.copyACLEntries(srcResourceId, targetResourceId, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to copy acl entries", e);
        }
    }

    @Override
    public void copyACLEntries(UUID srcResourceId, UUID targetResourceId, Connection conn)
        throws TechnicalPermissionException
    {
        try (PreparedStatement stmt = conn.prepareStatement(SQL_COPY_ACL_ENTRIES))
        {
            stmt.setString(1, targetResourceId.toString());
            stmt.setString(2, srcResourceId.toString());
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to copy acl entries", e);
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
