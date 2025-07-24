package org.knollinger.colab.user.claims;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.user.models.Group;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class GroupClaim
{
    private UUID uuid;
    private String name;
    private boolean primary;
    private List<Group> members = Collections.emptyList();

    /**
     * 
     * @return
     */
    public Group toGroup()
    {
        return Group.builder() //
            .uuid(this.uuid) //
            .name(this.name) //
            .primary(this.primary) //
            .build();
    }

    /**
     * 
     * @param groupClaims
     * @return
     */
    public static List<Group> toGroups(GroupClaim[] groupClaims)
    {
        List<Group> result = new ArrayList<>();
        for (GroupClaim groupClaim : groupClaims)
        {
            result.add(groupClaim.toGroup());
        }
        return result;
    }
}
