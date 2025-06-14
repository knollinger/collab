package org.knollinger.workingtogether.filesys.dtos;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class CheckDuplicateEntriesRequestDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    UUID targetFolderId;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    List<String> names;
}
