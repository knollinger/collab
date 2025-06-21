package org.knollinger.colab.search.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class SearchResultDTO
{
    List<INodeSearchResultItemDTO> inodes;
    List<UserSearchResultItemDTO> users;
    List<GroupSearchResultItemDTO> groups;
}
