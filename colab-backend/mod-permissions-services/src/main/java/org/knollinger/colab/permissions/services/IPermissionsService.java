package org.knollinger.colab.permissions.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.permissions.exceptions.TechnicalPermissionException;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;

/**
 * 
 */
public interface IPermissionsService
{
    /**
     * Erzeuge einen ACL-Eintrag 
     * 
     * @param resId Die UUID der Ziel-Resource
     * @param ownerId die UUID des Benutzers oder der Gruppe
     * @param type Der Typ des Owners (Benutzer/Gruppe)
     * @param perms die gewünschten Permissions, dies muss eine Kombination der
     *              Bits aus ACLEntry.PERM_* sein
     * @throws TechnicalPermissionException
     */
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms)
        throws TechnicalPermissionException;

    /**
     * Erzeuge einen ACL-Eintrag 
     * 
     * @param resId Die UUID der Ziel-Resource
     * @param ownerId die UUID des Benutzers oder der Gruppe
     * @param type Der Typ des Owners (Benutzer/Gruppe)
     * @param perms die gewünschten Permissions, dies muss eine Kombination der
     *              Bits aus ACLEntry.PERM_* sein
     * @param conn Die Datenbank-Verbindung in deren Transaktions-Klammer der 
     *             ACL-Eintrag erzeugt werden soll
     * @throws TechnicalPermissionException
     */
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms, Connection conn)
        throws TechnicalPermissionException;

    /**
     * Lösche alle ACL-Einträge für eine gegebene Resource
     * 
     * @param resId die UUID der Resource
     * 
     * @throws TechnicalPermissionException
     */
    public void deleteACLEntries(UUID resId) throws TechnicalPermissionException;

    /**
     * Lösche alle ACL-Einträge für eine gegebene Resource
     * 
     * @param resId die UUID der Resource
     * @param conn Die Datenbank-Verbindung in deren Transaktions-Klammer die 
     *             ACL-Einträge gelöscht werden sollen
     * 
     * @throws TechnicalPermissionException
     */
    public void deleteACLEntries(UUID resId, Connection conn) throws TechnicalPermissionException;

    /**
     * Ersetze die ACL-Einträge für eine gegebene Resource
     * 
     * @param resId die UUID der Resource
     * @param entries die neuen ACL-Einträge
     * 
     * @throws TechnicalPermissionException
     */
    public void replaceACLEntries(UUID resId, List<ACLEntry> entries) throws TechnicalPermissionException;
    
    
    /**
     * Ersetze die ACL-Einträge für eine gegebene Resource
     * 
     * @param resId die UUID der Resource
     * @param entries die neuen ACL-Einträge
     * @param conn Die Datenbank-Verbindung in deren Transaktions-Klammer die 
     *             ACL-Einträge ersetzt werden sollen
     * 
     * @throws TechnicalPermissionException
     */
    public void replaceACLEntries(UUID resId, List<ACLEntry> entry, Connection conn) throws TechnicalPermissionException;

    /**
     * Kopiere die ACL-Einträge einer Resource in eine ACL einer anderen Resource
     * 
     * @param srcResId die UUID der Quell-Resource
     * @param targetResId die UUID der Ziel-Resource
     * 
     * @throws TechnicalPermissionException
     */
    public void copyACLEntries(UUID srcResId, UUID targetResId) throws TechnicalPermissionException;

    /**
     * Kopiere die ACL-Einträge einer Resource in eine ACL einer anderen Resource
     * 
     * @param srcResId die UUID der Quell-Resource
     * @param targetResId die UUID der Ziel-Resource
     * @param conn Die Datenbank-Verbindung in deren Transaktions-Klammer die 
     *             ACL-Einträge kopiert werden sollen
     * 
     * @throws TechnicalPermissionException
     */
    public void copyACLEntries(UUID srcResId, UUID targetResId, Connection conn) throws TechnicalPermissionException;

    /**
     * Berechne die effektiven Verechtigungen des aktuellen Benutzers auf diese ACL
     * 
     * @param acl die ACL
     * @return eine BitMaske, welche sich aus den ACLEntry.PERM_* Bits zusammen setzt
     */
    public int getEffectivePermissions(ACL acl);
    
    /**
     * Kann der aktuelle Benutzer aus der Resource lesen?
     * @param acl
     * @return
     */
    public boolean canEffectiveRead(ACL acl);

    /**
     * Kann der aktuelle Benutzer in die Resource schreiben?
     * @param acl
     * @return
     */
    public boolean canEffectiveWrite(ACL acl);

    /**
     * Kann der aktuelle Benutzer die Resource löschen?
     * @param acl
     * @return
     */
    public boolean canEffectiveDelete(ACL acl);
}
