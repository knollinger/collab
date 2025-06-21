package org.knollinger.colab.hashtags.models;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class SaveHashtagsReq
{
    private UUID refId;
    private List<String> tags;
    public EHashTagType type;
}
