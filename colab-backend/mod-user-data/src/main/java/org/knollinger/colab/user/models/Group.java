package org.knollinger.colab.user.models;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

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
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class Group
{
    private UUID uuid;
    private String name;
    private boolean primary;
    @Builder.Default
    private List<Group> members = Collections.emptyList();
}
