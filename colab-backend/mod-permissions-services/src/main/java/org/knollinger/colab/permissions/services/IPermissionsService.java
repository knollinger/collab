package org.knollinger.colab.permissions.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.permissions.exceptions.TechnicalPermissionException;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;

/**
 * 
 */
public interface IPermissionsService
{
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms) throws TechnicalPermissionException;
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms, Connection conn) throws TechnicalPermissionException;
    
    public void createACLEntry(UUID resId, ACLEntry entry) throws TechnicalPermissionException;
    public void createACLEntry(UUID resId, ACLEntry entry, Connection conn) throws TechnicalPermissionException;
    
    public void createACLEntries(UUID resId, List<ACLEntry> entries) throws TechnicalPermissionException;
    public void createACLEntries(UUID resId, List<ACLEntry> entry, Connection conn) throws TechnicalPermissionException;
    
    public void deleteACLEntries(UUID resId) throws TechnicalPermissionException;;
    public void deleteACLEntries(UUID resId, Connection conn) throws TechnicalPermissionException;;
    
}
