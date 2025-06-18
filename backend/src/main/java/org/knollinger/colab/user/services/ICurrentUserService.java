package org.knollinger.colab.user.services;

import org.knollinger.colab.user.models.TokenPayload;

/**
 * 
 */
public interface ICurrentUserService
{
    /**
     * @param user
     */
    public void set(TokenPayload user);
    
    /**
     * @return
     */
    public TokenPayload get();
    
    /**
     * 
     */
    public void clear();
}
