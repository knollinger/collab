package org.knollinger.colab.hashtags.mapper;

import org.knollinger.colab.hashtags.dtos.SaveHashtagsReqDTO;
import org.knollinger.colab.hashtags.models.SaveHashtagsReq;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IHashTagMapper
{
    public SaveHashtagsReq fromDTO(SaveHashtagsReqDTO dto);
    public SaveHashtagsReqDTO toDTO(SaveHashtagsReq req);
}
