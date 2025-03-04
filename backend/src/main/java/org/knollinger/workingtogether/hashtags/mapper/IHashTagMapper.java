package org.knollinger.workingtogether.hashtags.mapper;

import java.util.List;

import org.knollinger.workingtogether.hashtags.dtos.HashTagDTO;
import org.knollinger.workingtogether.hashtags.models.HashTag;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IHashTagMapper {

	public HashTag fromDTO(HashTagDTO tag);
	public HashTagDTO toDTO(HashTag tag);
	
	public List<HashTag> fromDTO(List<HashTagDTO> tag);
	public List<HashTagDTO> toDTO(List<HashTag> tag);
	
}
