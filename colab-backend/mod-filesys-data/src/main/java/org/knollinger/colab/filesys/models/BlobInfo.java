package org.knollinger.colab.filesys.models;

import java.io.InputStream;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class BlobInfo
{
    private InputStream data;
    private long size;
    private String name;
    private String contentType;
    private String eTag;
}
