package org.knollinger.colab.user.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder()
@AllArgsConstructor()
@ToString()
public class UserDTO
{
    /**
     * Der Default-CTOR wird leider benötigt, da beim Parsen der Tokens
     * via Jackson ein solcher benötigt wird.
     */
    public UserDTO()
    {

    }

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private UUID userId;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String accountName;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String email;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String surname;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String lastname;
}
