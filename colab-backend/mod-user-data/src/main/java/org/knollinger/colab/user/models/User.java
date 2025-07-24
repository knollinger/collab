package org.knollinger.colab.user.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder()
@ToString()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class User
{
    public static final UUID EMPTY_USER_ID = UUID.fromString("ffffffff-ffff-ffff-ffff-ffffffffffff");

    private UUID userId;
    private String accountName;
    private String email;
    private String surname;
    private String lastname;

    /**
     * 
     * @return
     */
    public static User empty()
    {
        return new User(EMPTY_USER_ID, "", "", "", "");
    }

    /**
     * 
     * @return
     */
    public boolean isEmpty()
    {
        return this.userId == null || this.userId.equals(EMPTY_USER_ID);
    }
}
