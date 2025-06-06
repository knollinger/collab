package org.knollinger.workingtogether.hashtags.dtos;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.hashtags.models.EHashTagType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
public class SaveHashtagsReqDTO
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
