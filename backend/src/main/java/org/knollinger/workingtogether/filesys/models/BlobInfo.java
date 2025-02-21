package org.knollinger.workingtogether.filesys.models;

import java.io.InputStream;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class BlobInfo
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private InputStream data;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private long size;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String contentType;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String eTag;
}
