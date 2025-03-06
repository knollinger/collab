package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.models.User;

public interface ICurrentUserService
{
    public void set(User user);
    
    public User get();
    
    public void clear();
}
