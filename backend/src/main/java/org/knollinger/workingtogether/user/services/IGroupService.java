package org.knollinger.workingtogether.user.services;

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
    // Das Interface existiert nur, um gemeinsamme Eigenscgaften aller 
    // Gruppen-Services zu definieren
}
