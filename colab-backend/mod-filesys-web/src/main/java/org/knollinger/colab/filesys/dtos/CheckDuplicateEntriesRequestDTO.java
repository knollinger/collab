package org.knollinger.colab.filesys.dtos;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class CheckDuplicateEntriesRequestDTO
{
    UUID targetFolderId;
    List<String> names;
}
