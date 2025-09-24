package org.knollinger.colab.permissions.mapper;

import java.util.List;

import org.knollinger.colab.permissions.dtos.ACLDTO;
import org.knollinger.colab.permissions.dtos.ACLEntryDTO;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IPermissionsMapper
{
    public ACLEntry fromDTO(ACLEntryDTO dto);
    public ACLEntryDTO toDTO(ACLEntry entry);
    
    public List<ACLEntry> fromDTO(List<ACLEntryDTO> dto);
    public List<ACLEntryDTO> toDTO(List<ACLEntry> entry);
    
    public ACL fromDTO(ACLDTO dto);
    public ACLDTO toDTO(ACL acl);
}
