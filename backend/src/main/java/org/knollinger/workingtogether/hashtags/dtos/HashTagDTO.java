package org.knollinger.workingtogether.hashtags.dtos;

import java.util.UUID;

import org.knollinger.workingtogether.hashtags.models.EHashTagRefType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class HashTagDTO {

	@Getter(AccessLevel.PUBLIC)
	@Setter(AccessLevel.NONE)
	private UUID uuid;

	@Getter(AccessLevel.PUBLIC)
	@Setter(AccessLevel.NONE)
	private UUID refUUID;

	@Getter(AccessLevel.PUBLIC)
	@Setter(AccessLevel.NONE)
	private EHashTagRefType refType;

	@Getter(AccessLevel.PUBLIC)
	@Setter(AccessLevel.NONE)
	private String name;
}
