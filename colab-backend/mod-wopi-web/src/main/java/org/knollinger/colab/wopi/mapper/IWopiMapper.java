package org.knollinger.colab.wopi.mapper;

import java.util.List;

import org.knollinger.colab.wopi.dtos.WopiMimetypeMappingDTO;
import org.knollinger.colab.wopi.models.WopiMimetypeMapping;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IWopiMapper
{
    public WopiMimetypeMapping fromDTO(WopiMimetypeMappingDTO dto);
    public WopiMimetypeMappingDTO toDTO(WopiMimetypeMapping mapping);
    
    public List<WopiMimetypeMapping> fromDTO(List<WopiMimetypeMappingDTO> dto);
    public List<WopiMimetypeMappingDTO> toDTO(List<WopiMimetypeMapping> mapping);
    
}
