package org.knollinger.workingtogether.user.services.impl;

import org.knollinger.workingtogether.user.models.TokenPayload;
import org.knollinger.workingtogether.user.services.ICurrentUserService;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class CurrentUserServiceImpl implements ICurrentUserService
{
    private ThreadLocal<TokenPayload> currentUser = ThreadLocal.withInitial(() -> TokenPayload.empty());

    /**
     *
     */
    @Override
    public TokenPayload get()
    {
        return this.currentUser.get();
    }

    /**
     *
     */
    @Override
    public void clear()
    {
        this.currentUser.set(TokenPayload.empty());
    }

    /**
     *
     */
    @Override
    public void set(TokenPayload payload)
    {
        this.currentUser.set(payload);
    }
}
