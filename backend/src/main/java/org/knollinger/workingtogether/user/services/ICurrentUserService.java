package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.models.TokenPayload;

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
