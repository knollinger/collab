package org.knollinger.workingtogether.filesys.models;

import java.sql.Timestamp;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class INode
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String name;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID parent;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID owner;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID group;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private short perms;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String type;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private long size;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Timestamp created;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Timestamp modified;

    /**
     * 
     * @return
     */
    public boolean isDirectory()
    {
        return this.type.equalsIgnoreCase("inode/directory");
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
    public boolean isEmpty() {
        return this.uuid.equals(EWellknownINodeIDs.NONE.value());
    }
}
