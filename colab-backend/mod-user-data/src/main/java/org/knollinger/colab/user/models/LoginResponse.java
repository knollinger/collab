package org.knollinger.colab.user.models;

import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class LoginResponse
{
    private String token;
    private Timestamp expires;
}
