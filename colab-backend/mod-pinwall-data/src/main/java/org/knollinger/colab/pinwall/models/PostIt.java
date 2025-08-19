package org.knollinger.colab.pinwall.models;

import java.sql.Timestamp;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class PostIt
{
    private UUID uuid;
    private UUID owner;
    private EPostItType type;
    private String title;
    private String content;
    private Timestamp created;
    private Timestamp modified;
}
