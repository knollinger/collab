package org.knollinger.colab.search.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class SearchResultDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<INodeSearchResultItemDTO> inodes;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<UserSearchResultItemDTO> users;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<GroupSearchResultItemDTO> groups;
}
