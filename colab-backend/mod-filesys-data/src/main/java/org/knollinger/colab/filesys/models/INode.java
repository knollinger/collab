package org.knollinger.colab.filesys.models;

import java.sql.Timestamp;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class INode
{
    private String name;
    private UUID uuid;
    private UUID parent;
    private UUID owner;
    private UUID group;
    private String type;
    private long size;
    private Timestamp created;
    private Timestamp modified;
    private int perms;
    
    @Setter(AccessLevel.PUBLIC)    
    private int effectivePerms;

    /**
     * 
     * @return
     */
    public boolean isDirectory()
    {
        return this.type.toLowerCase().startsWith("inode/directory");
    }

    /**
     * @return
     */
    public static INode empty()
    {
        return INode.builder() //
            .name("") //
            .uuid(EWellknownINodeIDs.NONE.value()) //
            .parent(EWellknownINodeIDs.NONE.value()) //
            .owner(EWellknownINodeIDs.NONE.value()) //
            .type("") //
            .size(0) //
            .created(new Timestamp(0)) //
            .modified(new Timestamp(0)) //
            .build();
    }

    /**
     * @return
     */
    public boolean isEmpty()
    {
        return this.uuid.equals(EWellknownINodeIDs.NONE.value());
    }

    /**
     * @param perm
     * @return
     */
    public boolean hasEffectivePermission(int perm)
    {
        return (this.effectivePerms & perm) == perm;
    }
}
