package org.knollinger.colab.user.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor()
@ToString()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class UserDTO
{
    private UUID userId;
    private String accountName;
    private String email;
    private String surname;
    private String lastname;

    /**
     * Der Default-CTOR wird leider benötigt, da beim Parsen der Tokens
     * via Jackson ein solcher benötigt wird.
     */
    public UserDTO()
    {
    	
    }    
}
