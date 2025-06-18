package org.knollinger.colab.hashtags.models;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
public class SaveHashtagsReq
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID refId;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private List<String> tags;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    public EHashTagType type;
}
