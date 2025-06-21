package org.knollinger.colab.user.dtos;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Beschreibt eine Benutzergruppe
 */
@AllArgsConstructor
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class GroupDTO
{
    private UUID uuid;
    private String name;
    private boolean primary;
    private List<GroupDTO> members;

    /**
     * Der Default-CTOR wird leider benötigt, da beim Parsen der Tokens
     * via Jackson ein solcher benötigt wird.
     */
    public GroupDTO()
    {
    	
    }
}
