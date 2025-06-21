package org.knollinger.colab.wopi.models;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class WopiMimetypeMapping
{
    private String mimeType;
    
    @Builder.Default()
    private Map<String, URL> actionUrls = new HashMap<>();
}
