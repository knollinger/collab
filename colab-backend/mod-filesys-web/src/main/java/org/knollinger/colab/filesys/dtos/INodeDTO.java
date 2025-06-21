package org.knollinger.colab.filesys.dtos;

import java.sql.Timestamp;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class INodeDTO {

	private String name;
	private UUID uuid;
	private UUID parent;
	private UUID owner;
	private UUID group;
	private String type;
	private long size;
	private Timestamp created;
	private Timestamp modified;
	private int perms;
	private int effectivePerms;
}
