package org.knollinger.colab.user.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class SaveGroupMemberseRquestDTO {
	private GroupDTO parent;
	private List<GroupDTO> members;
}
