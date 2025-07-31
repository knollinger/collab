package org.knollinger.colab.filesys.mapper;

import java.util.List;

import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.models.INode;
import org.mapstruct.Mapper;

/**
 * 
 */
@Mapper(componentModel = "spring")
public interface IFileSysMapper
{
    /**
     * 
     * @param dto
     * @return
     */
    public INode fromDTO(INodeDTO dto);

    /**
     * 
     * @param inode
     * @return
     */
    public INodeDTO toDTO(INode inode);

    /**
     * 
     * @param dtos
     * @return
     */
    public List<INode> fromDTO(List<INodeDTO> dtos);

    /**
     * 
     * @param inodes
     * @return
     */
    public List<INodeDTO> toDTO(List<INode> inodes);
}
