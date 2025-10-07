package org.knollinger.colab.permissions.models;

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
    private List<ACLEntry> entries;

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
    public boolean isEmpty() {
        return this.ownerId == null;
    }
}
