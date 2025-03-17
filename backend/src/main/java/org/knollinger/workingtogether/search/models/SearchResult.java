package org.knollinger.workingtogether.search.models;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
public class SearchResult
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<INodeSearchResultItem> inodes;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<UserSearchResultItem> users;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<GroupSearchResultItem> groups;
    
}
