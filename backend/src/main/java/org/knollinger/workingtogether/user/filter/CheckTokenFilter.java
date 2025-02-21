package org.knollinger.workingtogether.user.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.knollinger.workingtogether.user.exceptions.ExpiredTokenException;
import org.knollinger.workingtogether.user.exceptions.InvalidTokenException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.ILoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

/**
 * Der TokenFilter prüft die Existenz eines JWT als Bearer-Token im AUthorization-Header.
 * 
 * Bei einigen URIs ist keine Authorization nötig (static content und co), das wird mit beachtet
 * 
 * 
 */
@Component
@Log4j2
public class CheckTokenFilter extends OncePerRequestFilter
{
    @Autowired
    private ILoginService loginSvc;

    private List<Pattern> excluded = new ArrayList<Pattern>();

    /**
     * 
     */
    public CheckTokenFilter()
    {
        this.excluded.add(Pattern.compile("/v1/session/login"));
    }

    /**
     *
     */
    @Override
    public void destroy()
    {
    }

    /**
     *
     */
    @Override
    protected void doFilterInternal(HttpServletRequest httpReq, HttpServletResponse httpRsp, FilterChain chain)
        throws IOException, ServletException
    {
        String reqUri = httpReq.getRequestURI();
        String authorization = this.getBearerCookie(httpReq);

        if (this.isOptionsRequest(httpReq) || !this.mustHaveAuthorization(reqUri)
            || this.isAuthorizationOk(authorization))
        {
            chain.doFilter(httpReq, httpRsp);
        }
        else
        {
            httpRsp.setStatus(401);
            httpRsp.setHeader("Access-Control-Allow-Origin", "*");
            httpRsp.getOutputStream().write("Ooooooops".getBytes());
        }
    }

    /**
     * 
     * @param httpReq
     * @return
     */
    private boolean isOptionsRequest(HttpServletRequest httpReq)
    {
        return httpReq.getMethod().equalsIgnoreCase("OPTIONS");
    }

    /**
     * 
     * @param reqUri
     * @return
     */
    private boolean mustHaveAuthorization(String reqUri)
    {
        for (Pattern p : this.excluded)
        {
            if (p.matcher(reqUri).matches())
            {
                return false;
            }
        }
        return true;
    }

    /**
     * @param authorization
     * @return
     */
    private boolean isAuthorizationOk(String authorization)
    {
        boolean result = false;

        if (authorization != null)
        {
            try
            {
                User user = this.loginSvc.validateToken(authorization); // Der User muss noch irgendwie weiter gegeben werden
                result = !user.isEmpty();
            }
            catch (InvalidTokenException | ExpiredTokenException | TechnicalLoginException e)
            {
                log.error(e.getMessage());
            }
        }
        return result;
    }

    /**
     * @param req
     * @return
     */
    private String getBearerCookie(HttpServletRequest req)
    {

        Cookie[] cookies = req.getCookies();
        if (cookies != null)
        {
            for (Cookie cookie : cookies)
            {
                if (cookie.getName().equalsIgnoreCase("Bearer"))
                {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
