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
    public static final int PERM_NONE   = 0b000;
    public static final int PERM_READ   = 0b100;
    public static final int PERM_WRITE  = 0b010;
    public static final int PERM_DELETE = 0b001;
    public static final int PERM_ALL = ACL.PERM_READ | ACL.PERM_WRITE | ACL.PERM_DELETE;
    
    private UUID ownerId;
    private UUID groupId;
    private List<ACLEntry> entries;

    public static ACL empty()
    {
        return new ACL(null, null, Collections.emptyList());
    }
    
    public boolean isEmpty() {
        return this.ownerId == null;
    }
}
