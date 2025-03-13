package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.models.TokenPayload;

public interface ICurrentUserService
{
    public void set(TokenPayload user);
    
    public TokenPayload get();
    
    public void clear();
}
