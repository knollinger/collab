package org.knollinger.workingtogether.user.models;

import java.util.ArrayList;
import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder()
@ToString
public class TokenPayload
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String token;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private User user;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private List<Group> groups;

    public static TokenPayload empty()
    {

        return TokenPayload.builder() //
            .user(User.empty()) //
            .groups(new ArrayList<Group>()).build();
    }

    public boolean isEmpty()
    {
        return this.user.isEmpty();
    }
}
