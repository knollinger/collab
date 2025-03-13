package org.knollinger.workingtogether.user.dtos;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.user.models.Group;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Beschreibt eine Benutzergruppe
 */
@Builder()
@AllArgsConstructor
public class GroupDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String name;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private boolean primary;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private List<Group> members;

    /**
     * Der Default-CTOR wird leider benötigt, da beim Parsen der Tokens
     * via Jackson ein solcher benötigt wird.
     */
    public GroupDTO()
    {

    }

}
