package org.knollinger.colab.user.controller;

import java.sql.Timestamp;

import org.knollinger.colab.user.dtos.LoginRequestDTO;
import org.knollinger.colab.user.dtos.LoginResponseDTO;
import org.knollinger.colab.user.exceptions.ExpiredTokenException;
import org.knollinger.colab.user.exceptions.InvalidTokenException;
import org.knollinger.colab.user.exceptions.LoginNotFoundException;
import org.knollinger.colab.user.exceptions.TechnicalLoginException;
import org.knollinger.colab.user.models.LoginResponse;
import org.knollinger.colab.user.models.TokenCreatorResult;
import org.knollinger.colab.user.services.ILoginService;
import org.knollinger.colab.user.services.ITokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 
 */
@RestController
@RequestMapping(path = "/v1/session")
public class LoginController
{
    @Autowired
    private ILoginService loginSvc;

    @Autowired
    private ITokenService tokenSvc;

    /**
     * Beim Logout wird einfach nur das Cookie gelöscht. EIne Session in dem Sinne
     * gibt es nicht, das Cookie beonhaltet einen JWT-BearerToken.
     * 
     * @param httpRsp
     */
    @DeleteMapping(path = "/logout")
    public void logout(HttpServletResponse httpRsp)
    {
        Cookie cookie = new Cookie("Bearer", "");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        httpRsp.addCookie(cookie);
    }

    /**
     * @param req
     * @return
     */
    @PostMapping(path = "/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO req, HttpServletResponse httpRsp)
    {
        try
        {
            TokenCreatorResult rsp;
            if (this.isPwdChange(req))
            {
                rsp = this.loginSvc.changePwd(req.getEmail(), req.getPassword(), req.getNewPwd(), req.isKeepLoggedIn());
            }
            else
            {
                rsp = this.loginSvc.login(req.getEmail(), req.getPassword(), req.isKeepLoggedIn());
            }

            Cookie cookie = this.createCookie(rsp);
            httpRsp.addCookie(cookie);

            return LoginResponseDTO.builder() //
                .token(rsp.token()) //
                .expires(new Timestamp(rsp.expires())) //
                .build();
        }
        catch (LoginNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        }
        catch (TechnicalLoginException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param token
     */
    @GetMapping(path = "/refreshToken")
    public LoginResponse refreshToken( //
        @CookieValue(name = "Bearer", required = false) String token, //
        HttpServletResponse httpRsp)
    {
        if (token != null)
        {
            try
            {
                TokenCreatorResult result = this.tokenSvc.refreshToken(token);
                Cookie cookie = this.createCookie(result);
                httpRsp.addCookie(cookie);

                return LoginResponse.builder() //
                    .expires(new Timestamp(result.expires())) //
                    .token(result.token()) //
                    .build();
            }
            catch (TechnicalLoginException e)
            {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
            }
            catch (InvalidTokenException | ExpiredTokenException e)
            {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
            }
        }
        return LoginResponse.builder() //
            .expires(new Timestamp(0)) //
            .token("") //
            .build();
    }

    /**
     * 
     * @param rsp
     * @param rememberMe 
     * @return
     */
    private Cookie createCookie(TokenCreatorResult token)
    {
        int maxAge = -1;
        if(token.isPersistent()) {
            
            long remainingMillies = token.expires() - System.currentTimeMillis();
            maxAge = (int)(remainingMillies / 1000);
        }
        Cookie cookie = new Cookie("Bearer", token.token());
        cookie.setMaxAge(maxAge);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        return cookie;
    }

    /**
     * 
     * @param request
     * @return
     */
    private boolean isPwdChange(LoginRequestDTO request)
    {
        String newPasswd = request.getNewPwd();
        return newPasswd != null && !newPasswd.isBlank();
    }
}
