package org.knollinger.workingtogether.wopi.mapper;

import java.util.List;

import org.knollinger.workingtogether.wopi.dtos.WopiMimetypeMappingDTO;
import org.knollinger.workingtogether.wopi.models.WopiMimetypeMapping;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IWopiMapper
{
    public WopiMimetypeMapping fromDTO(WopiMimetypeMappingDTO dto);
    public WopiMimetypeMappingDTO toDTO(WopiMimetypeMapping mapping);
    
    public List<WopiMimetypeMapping> fromDTO(List<WopiMimetypeMappingDTO> dto);
    public List<WopiMimetypeMappingDTO> toDTO(List<WopiMimetypeMapping> mapping);
    
}
