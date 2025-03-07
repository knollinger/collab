package org.knollinger.workingtogether.user.services.impl;

import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.ICurrentUserService;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class CurrentUserServiceImpl implements ICurrentUserService
{
    private ThreadLocal<User> currentUser = ThreadLocal.withInitial(() -> User.empty());

    @Override
    public User get()
    {
        return this.currentUser.get();
    }

    @Override
    public void clear()
    {
        this.currentUser.set(User.empty());
    }

    @Override
    public void set(User user)
    {
        this.currentUser.set(user);
    }
}
