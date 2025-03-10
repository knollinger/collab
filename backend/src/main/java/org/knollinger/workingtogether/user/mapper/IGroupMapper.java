package org.knollinger.workingtogether.user.mapper;

import java.util.List;

import org.knollinger.workingtogether.user.dtos.GroupDTO;
import org.knollinger.workingtogether.user.models.Group;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IGroupMapper
{
    public Group fromDTO(GroupDTO dto);
    public List<Group> fromDTO(List<GroupDTO> dto);
    
    public GroupDTO toDTO(Group group);
    public List<GroupDTO> toDTO(List<Group> group);
}
