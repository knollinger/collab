package org.knollinger.colab.user.dtos;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class CreateGroupRequestDTO
{
    private String name;
    private boolean isPrimary;
}
