package org.knollinger.colab.permissions.services;

import java.sql.Connection;
import java.util.UUID;

import org.knollinger.colab.permissions.exceptions.ACLNotFoundException;
import org.knollinger.colab.permissions.exceptions.DuplicateACLException;
import org.knollinger.colab.permissions.exceptions.TechnicalACLException;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.EACLEntryType;

/**
 * 
 */
public interface IPermissionsService
{
    /**
     * Erzeuge eine ACL
     * 
     * @param resId
     * @param acl
     * @throws TechnicalACLException
     * @throws DuplicateACLException
     */
    public void createACL(UUID resId, ACL acl) throws TechnicalACLException, DuplicateACLException;

    /**
     * Erzeuge eine ACL im Rahmen einer DB-Transaktion
     *
     * @param resId
     * @param acl
     * @param conn
     * @throws TechnicalACLException
     * @throws DuplicateACLException
     */
    public void createACL(UUID resId, ACL acl, Connection conn) throws TechnicalACLException, DuplicateACLException;

    /**
     * Erzeuge einen ACL-Eintrag 
     * 
     * @param resId Die UUID der Ziel-Resource
     * @param ownerId die UUID des Benutzers oder der Gruppe
     * @param type Der Typ des Owners (Benutzer/Gruppe)
     * @param perms die gewünschten Permissions, dies muss eine Kombination der
     *              Bits aus ACLEntry.PERM_* sein
     * @throws TechnicalACLException
     */
    public void createACLEntry(UUID resId, UUID ownerId, EACLEntryType type, int perms) throws TechnicalACLException;

    /**
     * @param resourceId
     * @return
     * @throws TechnicalACLException
     * @throws ACLNotFoundException
     */
    public ACL getACL(UUID resourceId) throws TechnicalACLException, ACLNotFoundException;

    /**
     * @param resourceId
     * @param conn
     * 
     * @return
     * @throws TechnicalACLException
     * @throws ACLNotFoundException
     */
    public ACL getACL(UUID resourceId, Connection conn) throws TechnicalACLException, ACLNotFoundException;

    /**
     * Kopiere eine komplette ACL einer gegebenen Resource auf eine ZielResource.
     * Sollte für die ZielResource bereits eine ACL existieren, so wird diese gelöscht.
     * 
     * @param srcResourceId
     * @param targetResourceId
     * @throws TechnicalACLException
     */
    public void copyACL(UUID srcResourceId, UUID targetResourceId) throws TechnicalACLException;

    /**
     * Kopiere eine komplette ACL einer gegebenen Resource auf eine ZielResource innerhalb
     * einer DB-Transaktion.
     * 
     * Sollte für die ZielResource bereits eine ACL existieren, so wird diese gelöscht.
     * 
     * @param srcResourceId
     * @param targetResourceId
     * @throws conn
     * @throws TechnicalACLException
     */
    public void copyACL(UUID srcResourceId, UUID targetResourceId, Connection conn) throws TechnicalACLException;

    /**
     * 
     * @param resourceId
     * @throws TechnicalACLException
     */
    public void deleteACL(UUID resourceId) throws TechnicalACLException;

    /**
     * 
     * @param resourceId
     * @param conn
     * @throws TechnicalACLException
     */
    public void deleteACL(UUID resourceId, Connection conn) throws TechnicalACLException;

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
