package org.knollinger.workingtogether.user.dtos;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder()
@ToString()
public class LoginRequestDTO
{
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String email;

    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String password;
    
    @Getter(AccessLevel.PUBLIC)
    @Setter(AccessLevel.NONE)
    private String newPwd;
}
