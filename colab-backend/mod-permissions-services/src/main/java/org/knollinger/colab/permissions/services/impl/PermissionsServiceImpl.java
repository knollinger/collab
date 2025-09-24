package org.knollinger.colab.permissions.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.permissions.exceptions.TechnicalPermissionException;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.utils.services.IDbService;
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

//    @Autowired()
    private IDbService dbSvc;

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
            stmt.setInt(4, perms);
            stmt.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to create acl entry", e);
        }
    }

    @Override
    public void createACLEntry(UUID resId, ACLEntry entry) throws TechnicalPermissionException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            this.createACLEntry(resId, entry.getUuid(), entry.getType(), entry.getPerms());
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to create acl entry", e);
        }
    }

    @Override
    public void createACLEntry(UUID resId, ACLEntry entry, Connection conn) throws TechnicalPermissionException
    {
        // TODO Auto-generated method stub
    }

    @Override
    public void createACLEntries(UUID resId, List<ACLEntry> entries) throws TechnicalPermissionException
    {
        try (Connection conn = this.dbSvc.openConnection())
        {
            this.createACLEntries(resId, entries, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to create acl entry", e);
        }
    }

    @Override
    public void createACLEntries(UUID resId, List<ACLEntry> entries, Connection conn)
        throws TechnicalPermissionException
    {
        for (ACLEntry entry : entries)
        {
            this.createACLEntry(resId, entry);
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
        }
        catch (SQLException e)
        {
            throw new TechnicalPermissionException("unable to delete acl entries", e);
        }
    }
}
