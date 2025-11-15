package org.knollinger.colab.permissions.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Beschreibt einen Eintrag in einer ACL.
 * 
 * Ein solcher Eintrag ist durch folgende Werte definiert:
 * 
 * <ul>
 * <li>Die OwnerId des Eintrags. Dabei kann es sich um einen Benutzer oder eine Gruppe handeln
 * <li>den OwnerType (Gruppe oder Benutzer)
 * <li>Die BitMaske der Berechtigungen
 * </ul>
 * 
 * Alle Test-Methoden prüfen lediglich die Bitmaske, es wird <b>nicht</b>
 * gegen den aktuellen Benutzer getestet! Dies ist Aufgabe der übergeordneten ACL.
 */
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@Builder()
public class ACLEntry
{
    public static final int PERM_NONE = 0b000;
    public static final int PERM_READ = 0b100;
    public static final int PERM_WRITE = 0b010;
    public static final int PERM_DELETE = 0b001;
    public static final int PERM_ALL = ACLEntry.PERM_READ | ACLEntry.PERM_WRITE | ACLEntry.PERM_DELETE;

    private UUID uuid;
    private EACLEntryType type;
    private int perms;

    /**
     * Hat der ACL-Eintrag die geforderten Permissions?
     * 
     * @param perms
     * @return
     */
    public boolean hasPermissions(int perms)
    {

        int normalized = ACLEntry.normalizePermissions(perms);
        return (this.perms & normalized) == normalized;
    }
    
    public void setPermissions(int perms) {
        this.perms = ACLEntry.normalizePermissions(perms);
    }

    public boolean hasReadPerm()
    {
        return this.hasPermissions(ACLEntry.PERM_READ);
    }

    public void setReadPerm()
    {
        this.perms |= ACLEntry.PERM_READ;
    }

    public void clearReadPerm()
    {
        this.perms &= ~ACLEntry.PERM_READ;
    }

    public boolean hasWritePerm()
    {
        return this.hasPermissions(ACLEntry.PERM_WRITE);
    }

    public void setWritePerm()
    {
        this.perms |= ACLEntry.PERM_WRITE;
    }

    public void clearWritePerm()
    {
        this.perms &= ~ACLEntry.PERM_WRITE;
    }

    public boolean hasDeletePerm()
    {
        return this.hasPermissions(ACLEntry.PERM_DELETE);
    }

    public void setDeletePerm()
    {
        this.perms |= ACLEntry.PERM_DELETE;
    }

    public void clearDeletePerm()
    {
        this.perms &= ~ACLEntry.PERM_DELETE;
    }

    public static int normalizePermissions(int perms)
    {
        return perms & ACLEntry.PERM_ALL;
    }
}
