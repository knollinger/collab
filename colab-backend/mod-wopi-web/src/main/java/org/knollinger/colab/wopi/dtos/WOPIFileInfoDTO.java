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
 @Getter(AccessLevel.PUBLIC)
 @Setter(AccessLevel.NONE)
public class WOPIFileInfoDTO
{
    @JsonProperty("BaseFileName")
    String baseFileName;

    @JsonProperty("OwnerId")
    UUID owner;

    @JsonProperty("UserId")
    UUID userId;
    
    @JsonProperty("UserFriendlyName")
    String userFriendlyName;
    
    @JsonProperty("Size")
    long size;
    
    @JsonProperty("UserCanWrite")
    @Builder.Default
    boolean canWrite = false;
}
