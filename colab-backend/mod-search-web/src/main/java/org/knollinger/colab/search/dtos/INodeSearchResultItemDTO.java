package org.knollinger.colab.search.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class INodeSearchResultItemDTO
{
    private String name;
    private UUID uuid;
    private UUID parent;
}
