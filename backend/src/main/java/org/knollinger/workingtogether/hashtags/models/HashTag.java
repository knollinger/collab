package org.knollinger.workingtogether.hashtags.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class HashTag {

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
