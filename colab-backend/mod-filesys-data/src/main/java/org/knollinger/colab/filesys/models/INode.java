package org.knollinger.colab.filesys.models;

import java.sql.Timestamp;
import java.util.UUID;

import org.knollinger.colab.permissions.models.ACL;

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
    private UUID linkTo;
    private UUID owner;
    private UUID group;
    private String type;
    private long size;
    private Timestamp created;
    private Timestamp modified;
    private ACL acl;

    /**
     * @return
     */
    public static INode empty()
    {
        return INode.builder() //
            .name("") //
            .uuid(EWellknownINodeIDs.NONE.value()) //
            .parent(EWellknownINodeIDs.NONE.value()) //
            .linkTo(null) //
            .owner(EWellknownINodeIDs.NONE.value()) //
            .type("") //
            .size(0) //
            .created(new Timestamp(0)) //
            .modified(new Timestamp(0)) //
            .acl(ACL.empty()) //
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
    public boolean isLink() {
        return this.linkTo != null;
    }
}
