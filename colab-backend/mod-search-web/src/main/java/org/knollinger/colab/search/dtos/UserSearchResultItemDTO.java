package org.knollinger.colab.search.dtos;

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
public class UserSearchResultItemDTO
{
    private String accountName;
    private String lastName;
    private String surName;
    private String email;
    private UUID uuid;

}
