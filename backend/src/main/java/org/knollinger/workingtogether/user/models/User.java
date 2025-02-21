package org.knollinger.workingtogether.user.models;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder()
@ToString()
public class User
{
    public static final UUID EMPTY_USER_ID = UUID.fromString("ffffffff-ffff-ffff-ffff-ffffffffffff");

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
        return this.userId.equals(EMPTY_USER_ID);
    }
}
