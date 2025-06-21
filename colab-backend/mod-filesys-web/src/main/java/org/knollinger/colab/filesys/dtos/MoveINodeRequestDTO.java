package org.knollinger.colab.filesys.dtos;

import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class MoveINodeRequestDTO
{
    private List<INodeDTO> source;
    private INodeDTO target;
}
