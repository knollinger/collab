package org.knollinger.colab.user.models;

import java.util.List;
import java.util.UUID;

import io.jsonwebtoken.lang.Collections;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Beschreibt eine Benutzergruppe
 */
@Builder
@ToString()
public class Group
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
    @Builder.Default
    private List<Group> members = Collections.emptyList();
}
