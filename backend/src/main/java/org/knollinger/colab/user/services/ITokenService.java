package org.knollinger.colab.user.services;

import java.util.List;

import org.knollinger.colab.user.exceptions.ExpiredTokenException;
import org.knollinger.colab.user.exceptions.InvalidTokenException;
import org.knollinger.colab.user.exceptions.TechnicalLoginException;
import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.models.TokenCreatorResult;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.models.User;

/**
 * 
 */
public interface ITokenService
{
    /**
     * Erzeuge einen Token mit dem gegebenen Benutzer zbd der gegebenen Gruppen-Liste
     * 
     * @param user
     * @param groups
     * @param ttl die LiveTime des Tokens in Millisekunden
     * 
     * @return
     * @throws TechnicalLoginException
     */
    public TokenCreatorResult createToken(User user, List<Group> groups, long ttl) throws TechnicalLoginException;

    /**
     * Validiere und parse den Token.
     * 
     * @param token
     * @return
     * @throws TechnicalLoginException
     * @throws InvalidTokenException
     * @throws ExpiredTokenException
     */
    public TokenPayload validateToken(String token)
        throws TechnicalLoginException, InvalidTokenException, ExpiredTokenException;

    /**
     * Aktualisiere den gegebenen Token. Dazu wird der Token mittels {@link ITokenService#validateToken(String)}
     * validiert. Die Claims aus dem JWT werden geparsed und ls {@link TokenCreatorResult} geliefert.
     * 
     * @param token
     * @return
     * @throws InvalidTokenException
     * @throws ExpiredTokenException
     * @throws TechnicalLoginException 
     */
    public TokenCreatorResult refreshToken(String token, long ttl) throws InvalidTokenException, ExpiredTokenException, TechnicalLoginException;
}
