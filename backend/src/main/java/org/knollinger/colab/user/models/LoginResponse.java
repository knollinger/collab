package org.knollinger.colab.user.models;

import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
public class LoginResponse
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String token;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private Timestamp expires;
}
