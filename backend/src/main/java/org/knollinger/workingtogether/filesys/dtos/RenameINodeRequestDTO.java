package org.knollinger.workingtogether.filesys.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class RenameINodeRequestDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String name;
}
