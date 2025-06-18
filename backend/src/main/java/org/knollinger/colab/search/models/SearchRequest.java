package org.knollinger.colab.search.models;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class SearchRequest
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private List<String>search;
}
