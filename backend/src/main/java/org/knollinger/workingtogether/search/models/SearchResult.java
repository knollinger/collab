package org.knollinger.workingtogether.search.models;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class SearchResult
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<INodeSearchResultItem> inodes;
}
