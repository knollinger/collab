package org.knollinger.colab.pinwall.mapper;

import java.util.List;

import org.knollinger.colab.pinwall.dtos.PostItDTO;
import org.knollinger.colab.pinwall.models.PostIt;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IPinwallMapper
{
    public PostItDTO toDTO(PostIt postIt);
    public PostIt fromDTO(PostItDTO dto);

    public List<PostItDTO> toDTO(List<PostIt> postIt);
    public List<PostIt> fromDTO(List<PostItDTO> dto);
}
