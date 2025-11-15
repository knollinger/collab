package org.knollinger.colab.permissions.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@Builder()
public class ACL
{
    private UUID ownerId;
    private UUID groupId;

    @Builder.Default()
    private List<ACLEntry> entries = new ArrayList<>();

    /**
     * Erzeuge eine EmptyACL.
     * 
     * Eine EmptyACL kann anstatt eines NullPointers in den verwendenden
     * Resourcen dienen. Klar, ein Optional wäre da auch eine Lösung, die
     * mag ich aber nicht :-)
     * 
     * @return
     */
    public static ACL empty()
    {
        return new ACL(null, null, Collections.emptyList());
    }

    /**
     * handelt es sich um eine EmptyACL?
     * 
     * @return
     */
    public boolean isEmpty()
    {
        return this.ownerId == null;
    }

    /**
     * Erzeuge die Standard-ACL für einen gegebenen User.
     * 
     * Da die GruppenId eines Benutzers identisch zu seiner BenutzerId
     * ist, können wir hier einfach Owner und Group setzen.
     * 
     * Für Owner und Group werden ACLEntries mit der Permission 
     * ACLEntry.PERM_ALL angelegt.
     * 
     * @param ownerId
     * @return
     */
    public static ACL createOwnerACL(UUID ownerId)
    {
        List<ACLEntry> entries = new ArrayList<>();
        entries.add(new ACLEntry(ownerId, EACLEntryType.USER, ACLEntry.PERM_ALL));
        entries.add(new ACLEntry(ownerId, EACLEntryType.GROUP, ACLEntry.PERM_ALL));
        return new ACL(ownerId, ownerId, entries);
    }
}
