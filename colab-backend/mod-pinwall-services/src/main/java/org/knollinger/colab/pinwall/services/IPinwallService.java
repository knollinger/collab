package org.knollinger.colab.pinwall.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinwall.exc.NotFoundException;
import org.knollinger.colab.pinwall.exc.TechnicalPillwallException;
import org.knollinger.colab.pinwall.models.PostIt;

public interface IPinwallService
{
    /**
     * @return
     * @throws TechnicalPillwallException
     */
    public List<PostIt> getAll() throws TechnicalPillwallException;

    /**
     * @param uuid
     * @return
     * @throws TechnicalPillwallException
     * @throws NotFoundException
     */
    public PostIt get(UUID uuid) throws TechnicalPillwallException, NotFoundException;
    
    /**
     * @param postIt
     * @return
     * @throws TechnicalPillwallException
     */
    public PostIt create(PostIt postIt) throws TechnicalPillwallException;
    
    /**
     * @param postIt
     * @return
     * @throws TechnicalPillwallException
     * @throws NotFoundException
     */
    public PostIt update(PostIt postIt) throws TechnicalPillwallException, NotFoundException;
    
    /**
     * @param uuid
     * @throws TechnicalPillwallException
     * @throws NotFoundException
     */
    public void delete(UUID uuid) throws TechnicalPillwallException, NotFoundException;
}
