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
    public void setToken(TokenPayload user);
    
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
     * @param language
     */
    public void setLanguage(String language);
    
    /**
     * 
     * @return
     */
    public String getLanguage();
    
    /**
     * 
     */
    public void clear();
}
