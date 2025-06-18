package org.knollinger.colab.wopi.dtos;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class WopiMimetypeMappingDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String mimeType;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @Builder.Default()
    private Map<String, URL> actionUrls = new HashMap<>();
}
