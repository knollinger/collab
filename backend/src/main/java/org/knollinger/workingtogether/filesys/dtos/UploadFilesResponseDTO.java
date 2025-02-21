package org.knollinger.workingtogether.filesys.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * 
 */
@Builder()
public class UploadFilesResponseDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    public List<INodeDTO> newINodes;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    public List<INodeDTO> duplicateFiles;
}
