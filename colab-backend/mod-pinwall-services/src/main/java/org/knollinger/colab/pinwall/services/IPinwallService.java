package org.knollinger.colab.pinwall.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinwall.exc.NotFoundException;
import org.knollinger.colab.pinwall.exc.TechnicalPinwallException;
import org.knollinger.colab.pinwall.models.PostIt;

public interface IPinwallService
{
    /**
     * @return
     * @throws TechnicalPinwallException
     */
    public List<PostIt> getAll() throws TechnicalPinwallException;

    /**
     * @param uuid
     * @return
     * @throws TechnicalPinwallException
     * @throws NotFoundException
     */
    public PostIt get(UUID uuid) throws TechnicalPinwallException, NotFoundException;
    
    /**
     * @param postIt
     * @return
     * @throws TechnicalPinwallException
     */
    public PostIt create(PostIt postIt) throws TechnicalPinwallException;
    
    /**
     * @param postIt
     * @return
     * @throws TechnicalPinwallException
     * @throws NotFoundException
     */
    public PostIt update(PostIt postIt) throws TechnicalPinwallException, NotFoundException;
    
    /**
     * @param uuid
     * @throws TechnicalPinwallException
     * @throws NotFoundException
     */
    public void delete(UUID uuid) throws TechnicalPinwallException, NotFoundException;
}
