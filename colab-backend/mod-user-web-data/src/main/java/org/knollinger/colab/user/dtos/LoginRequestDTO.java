package org.knollinger.colab.user.dtos;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public class LoginRequestDTO {

	private String email;
	private String password;
	private String newPwd;
	private boolean keepLoggedIn;
}
