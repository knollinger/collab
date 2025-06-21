package org.knollinger.colab.hashtags.dtos;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.hashtags.models.EHashTagType;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class SaveHashtagsReqDTO
{
    private UUID refId;
    private List<String> tags;
    public EHashTagType type;
}
