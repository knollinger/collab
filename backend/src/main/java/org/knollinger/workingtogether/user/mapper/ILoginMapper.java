package org.knollinger.workingtogether.user.mapper;

import org.knollinger.workingtogether.user.dtos.LoginResponseDTO;
import org.knollinger.workingtogether.user.models.LoginResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface ILoginMapper
{
    public LoginResponse fromDTO(LoginResponseDTO dto);
    public LoginResponseDTO toDTO(LoginResponse response);
}
