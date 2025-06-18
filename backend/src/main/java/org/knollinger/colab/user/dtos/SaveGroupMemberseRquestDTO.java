package org.knollinger.colab.user.dtos;

import java.util.List;

import org.knollinger.colab.user.models.Group;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class SaveGroupMemberseRquestDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Group parent;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private List<Group> members;
}
