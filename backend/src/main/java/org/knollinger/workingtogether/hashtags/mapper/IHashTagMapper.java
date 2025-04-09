package org.knollinger.workingtogether.hashtags.mapper;

import org.knollinger.workingtogether.hashtags.dtos.SaveHashtagsReqDTO;
import org.knollinger.workingtogether.hashtags.models.SaveHashtagsReq;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IHashTagMapper
{
    public SaveHashtagsReq fromDTO(SaveHashtagsReqDTO dto);
    public SaveHashtagsReqDTO toDTO(SaveHashtagsReq req);
}
