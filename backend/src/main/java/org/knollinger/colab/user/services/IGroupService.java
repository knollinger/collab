package org.knollinger.colab.user.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.user.exceptions.DuplicateGroupException;
import org.knollinger.colab.user.exceptions.GroupNotFoundException;
import org.knollinger.colab.user.exceptions.TechnicalGroupException;
import org.knollinger.colab.user.models.Group;

/**
 * Gruppen sind was spezielles. Es existieren zwei Ausprägungen:
 * <ul>
 * <li>PrimaryGroups
 *     <p>
 *        Dabei handelt es sich um die Gruppen, welche exakt einem Benutzer 
 *        gehören und (implizit) auch nur diesen beinhalten
 *     </p>
 *     <p>
 *        PrimaryGroups zeichnen sich dadurch aus, das Ihre UUID dieselbe wie
 *        die UUID des besitzenden Benutzers ist. Einer solchen Gruppe können
 *        keine weiteren Member zugewiesen werden.
 *     </p>
 *  </li>
 * <li>SecondaryGroups
 *     <p>
 *        Sekundäre Gruppen können weitere Gruppen beinhalten, also auch 
 *        PrimaryGroups
 *     </p>
 *     <p>
 *        Dabei besteht eine n:m Beziehung. Jede Gruppe kann also mehrere
 *        Gruppen beinhalten und selbst Mitglied mehrerer Gruppen sein
 *     </p>
 * </li>
 * </ul
 */
public interface IGroupService
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
     * Liefere die Liste aller Gruppen, welcher ein User angehört. 
     * 
     * Dabei werden Gruppen-Zugehörigkeiten rekursiv aufgelöst, so das alle Gruppen
     * in der Liste enthalten sind.
     * 
     * Ein Beispiel:
     * 
     * Der Benutzer gehört der Gruppe "B" an, die Gruppe ist Mitglied der Gruppe "A".
     * In der Ergebis-Liste sind beide Gruppen ("A" und "B") enthalten.
     * 
     * @param user
     * @return
     * @throws TechnicalGroupException
     */
    public List<Group> getGroupsByUser(UUID userId) throws TechnicalGroupException;

    /**
     * @param parent
     * @param members
     * @throws GroupNotFoundException
     * @throws TechnicalGroupException
     */
    public void saveGroupMembers(Group parent, List<Group> members)
        throws GroupNotFoundException, TechnicalGroupException;

    /**
     * @param name
     * @param isPrimary 
     * @return
     * @throws DuplicateGroupException
     * @throws TechnicalGroupException
     */
    public Group createGroup(String name, boolean isPrimary) throws DuplicateGroupException, TechnicalGroupException;
}
