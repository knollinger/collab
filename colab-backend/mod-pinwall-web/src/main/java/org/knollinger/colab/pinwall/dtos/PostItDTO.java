package org.knollinger.colab.pinwall.dtos;

import java.sql.Timestamp;
import java.util.UUID;

import org.knollinger.colab.pinwall.models.EPostItType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class PostItDTO
{
    private UUID uuid;
    private UUID owner;
    private EPostItType type;
    private String title;
    private String content;
    private Timestamp created;
    private Timestamp modified;
}
