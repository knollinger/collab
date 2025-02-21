package org.knollinger.workingtogether.user.mapper;

import java.util.List;

import org.knollinger.workingtogether.user.dtos.UserDTO;
import org.knollinger.workingtogether.user.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IUserMapper
{
    public User fromDTO(UserDTO dto);
    public List<User> fromDTO(List<UserDTO> dto);
    
    public UserDTO toDTO(User user);
    public List<UserDTO> toDTO(List<User> user);
}
