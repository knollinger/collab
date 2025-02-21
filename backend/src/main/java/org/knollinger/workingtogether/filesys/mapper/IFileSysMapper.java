package org.knollinger.workingtogether.filesys.mapper;

import java.util.List;

import org.knollinger.workingtogether.filesys.dtos.INodeDTO;
import org.knollinger.workingtogether.filesys.models.INode;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IFileSysMapper
{
    public INode fromDTO(INodeDTO dto);
    public INodeDTO toDTO(INode inode);

    public List<INode> fromDTO(List<INodeDTO> dtos);
    public List<INodeDTO> toDTO(List<INode> inodes);
}
