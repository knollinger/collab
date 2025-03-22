package org.knollinger.workingtogether.user.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.knollinger.workingtogether.user.exceptions.ExpiredTokenException;
import org.knollinger.workingtogether.user.exceptions.InvalidTokenException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.models.TokenPayload;
import org.knollinger.workingtogether.user.services.ICurrentUserService;
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

    @Autowired
    private ICurrentUserService currentUserSvc;

    private List<Pattern> excluded = new ArrayList<Pattern>();

    /**
     * 
     */
    public CheckTokenFilter()
    {
        this.excluded.add(Pattern.compile("/v1/session/login"));

        // Der OfficeIntegration-Kram verwendet keine Cookies 
        // sondern RequestParameter. Eine Sec-Katastophe!
//        this.excluded.add(Pattern.compile("/wopi/files/.*"));
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
        String token = this.getTokenValue(httpReq);
        TokenPayload payload = this.extractPayload(token);

        if (this.isOptionsRequest(httpReq) || !this.mustHaveAuthorization(reqUri) || !payload.isEmpty())
        {
            try
            {
                this.currentUserSvc.set(payload);
                chain.doFilter(httpReq, httpRsp);
            }
            finally
            {
                this.currentUserSvc.clear();
            }
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
    private TokenPayload extractPayload(String authorization)
    {
        TokenPayload result = TokenPayload.empty();

        if (authorization != null)
        {
            try
            {
                result = this.loginSvc.validateToken(authorization);
            }
            catch (InvalidTokenException | ExpiredTokenException | TechnicalLoginException e)
            {
                log.error(e.getMessage());
            }
        }
        return result;
    }

    /**
     * Die "normalen" REST-Calls senden den Bearer-Token natürlich als Cookie.
     * Es gibt leider die WOPI-Exoten (für die LibreOffice-Integration). Diese 
     * senden das Token als "access-token"-Query-Parameter.
     * 
     * Die Methode checked zuerst das Cookie, danach den QueryParam.
     * 
     * @param req
     * @return <code>null</code> wenn weder Cookie noch QueryParam gefunden 
     *         worden. Sonst den TokenString
     */
    private String getTokenValue(HttpServletRequest req)
    {

        String result = this.getTokenFromCookie(req);
        if (result == null)
        {
            result = this.getTokenFromQueryParam(req);
        }
        return result;
    }

    /**
     * @param req
     * @return
     */
    private String getTokenFromCookie(HttpServletRequest req)
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

    /**
     * Einige RestCalls (vor allem die WOPI-Calls) können keinen Cookie liefern, 
     * statt dessen kommt das Token als QueryParameter "access-token".
     * 
     * Das ist eine Security-technische Katasrophe, aber es geht leider nicht 
     * anders.
     * 
     * @param req
     * @return
     */
    private String getTokenFromQueryParam(HttpServletRequest req)
    {
        String queryString = req.getQueryString();
        if (queryString != null)
        {
            for (String keyValue : queryString.split("&"))
            {
                if (keyValue.startsWith("access_token="))
                {
                    return keyValue.substring("access_token=".length());
                }
            }
        }

        return null;
    }
}
