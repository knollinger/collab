package org.knollinger.colab.wopi.dtos;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Das DTO welches die FileInfos für die Wopi-API liefert.
 * 
 * Die API ist...naja. Wer zu Geier verwendet CamelCase in JSON?
 * 
 * Wir transformieren das ganze freundlich via @JsonProperty...nunja
 */
 @Builder
public class WOPIFileInfoDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @JsonProperty("BaseFileName")
    String baseFileName;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @JsonProperty("OwnerId")
    UUID owner;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @JsonProperty("UserId")
    UUID userId;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @JsonProperty("UserFriendlyName")
    String userFriendlyName;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @JsonProperty("Size")
    long size;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    @JsonProperty("UserCanWrite")
    @Builder.Default
    boolean canWrite = false;
}
