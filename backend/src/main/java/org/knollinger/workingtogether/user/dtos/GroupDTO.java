package org.knollinger.workingtogether.user.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

/**
 * Beschreibt eine Benutzergruppe
 */
public class GroupDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String name;
}
