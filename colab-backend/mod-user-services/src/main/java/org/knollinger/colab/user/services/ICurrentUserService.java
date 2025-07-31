package org.knollinger.colab.user.services;

import java.util.List;

import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.models.User;

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
     * @return
     */
    public User getUser();
    
    /**
     * @return
     */
    public List<Group> getGroups();
    
    /**
     * 
     */
    public void clear();
}
