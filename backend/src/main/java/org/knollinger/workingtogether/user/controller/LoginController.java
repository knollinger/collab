package org.knollinger.workingtogether.user.controller;

import java.sql.Timestamp;

import org.knollinger.workingtogether.user.dtos.LoginRequestDTO;
import org.knollinger.workingtogether.user.dtos.LoginResponseDTO;
import org.knollinger.workingtogether.user.exceptions.ExpiredTokenException;
import org.knollinger.workingtogether.user.exceptions.InvalidTokenException;
import org.knollinger.workingtogether.user.exceptions.LoginNotFoundException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.mapper.ILoginMapper;
import org.knollinger.workingtogether.user.models.LoginResponse;
import org.knollinger.workingtogether.user.models.TokenCreatorResult;
import org.knollinger.workingtogether.user.services.ILoginService;
import org.knollinger.workingtogether.user.services.ITokenService;
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
    private static final long TWO_HOURS_IN_MILLIES = 2 * 60 * 60 * 1000L;

    @Autowired
    private ILoginService loginSvc;

    @Autowired
    private ITokenService tokenSvc;

    @Autowired
    private ILoginMapper loginMapper;

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
     * @param request
     * @return
     */
    @PostMapping(path = "/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request, HttpServletResponse httpRsp)
    {
        try
        {
            LoginResponse rsp;
            if (this.isPwdChange(request))
            {
                rsp = this.loginSvc.changePwd(request.getEmail(), request.getPassword(), request.getNewPwd());
            }
            else
            {
                rsp = this.loginSvc.login(request.getEmail(), request.getPassword());
            }

            Cookie cookie = this.createCookie(rsp.getToken());
            httpRsp.addCookie(cookie);
            return this.loginMapper.toDTO(rsp);
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
                TokenCreatorResult result = this.tokenSvc.refreshToken(token, TWO_HOURS_IN_MILLIES);
                Cookie cookie = this.createCookie(result.token());
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
            catch (InvalidTokenException  | ExpiredTokenException e)
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
    private Cookie createCookie(String token)
    {
        Cookie cookie = new Cookie("Bearer", token);
        cookie.setMaxAge(-1);
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
