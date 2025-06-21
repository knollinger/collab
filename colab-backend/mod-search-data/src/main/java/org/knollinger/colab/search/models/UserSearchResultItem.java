package org.knollinger.colab.search.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class UserSearchResultItem
{
    private String accountName;
    private String lastName;
    private String surName;
    private String email;
    private UUID uuid;
}
