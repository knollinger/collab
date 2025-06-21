package org.knollinger.colab.filesys.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * 
 */
@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class UploadFilesResponseDTO
{
    public List<INodeDTO> newINodes;
    public List<INodeDTO> duplicateFiles;
}
