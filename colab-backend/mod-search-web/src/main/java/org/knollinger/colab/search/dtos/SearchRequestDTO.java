package org.knollinger.colab.search.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class SearchRequestDTO
{
    private List<String>search;
}
