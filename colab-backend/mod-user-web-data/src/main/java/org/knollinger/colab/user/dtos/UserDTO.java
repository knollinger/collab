package org.knollinger.colab.user.dtos;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder()
@ToString()
@NoArgsConstructor()
@AllArgsConstructor
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class UserDTO
{
    private UUID userId;
    private String accountName;
    private String email;
    private String surname;
    private String lastname;
}
