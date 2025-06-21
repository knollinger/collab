package org.knollinger.colab.search.models;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class SearchResult
{
    List<INodeSearchResultItem> inodes;
    List<UserSearchResultItem> users;
    List<GroupSearchResultItem> groups;
}
