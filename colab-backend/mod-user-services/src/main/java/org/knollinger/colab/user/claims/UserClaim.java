package org.knollinger.colab.user.claims;

import java.util.UUID;

import org.knollinger.colab.user.models.User;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor()
@AllArgsConstructor()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class UserClaim
{
    private UUID userId;
    private String accountName;
    private String email;
    private String surname;
    private String lastname;

    /**
     * 
     * @return
     */
    public User toUser()
    {
        return User.builder() //
            .userId(this.userId) //
            .accountName(this.accountName) //
            .email(this.email) //
            .surname(this.surname) //
            .lastname(this.lastname) //
            .build();
    }
}
