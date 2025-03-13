package org.knollinger.workingtogether.user.services;

import java.util.List;

import org.knollinger.workingtogether.user.exceptions.TechnicalGroupException;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.models.User;

/**
 * <p>
 * Das (rekursive) Auflisten aller Gruppen ist nicht ganz trivial, deswegen wird das 
 * ganze in einen eigenen Service verbannt.
 * </p>
 * @see IGroupService
 */
public interface IListGroupService extends IGroupService
{
    /**
     * Liefere die Liste alle Gruppen, sortiert nach Ihren Namen.
     * 
     * @param deepScan wenn <code>true</code>, werden rekursiv alle Member für 
     *                 die Gruppen geliefert. In diesem Fall werden für die
     *                 Member-Gruppen auch alle Primär-Gruppen aufgelistet.
     *                 
     * @return Die Liste (ggf. der Tree) aller Gruppen, niemals <code>null</code>
     * 
     * @throws TechnicalGroupException
     */
    public List<Group> getAllGroups(boolean deepScan) throws TechnicalGroupException;
    
    /**
     * @param user
     * @return
     * @throws TechnicalGroupException
     */
    public List<Group> getGroupsByUser(User user) throws TechnicalGroupException;
}
