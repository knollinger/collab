package org.knollinger.colab.user.services;

import java.util.UUID;

import org.knollinger.colab.user.exceptions.GroupNotFoundException;
import org.knollinger.colab.user.exceptions.TechnicalGroupException;

/**
 * Das löschen einer BenutzerGruppe ist nicht ganz trivial, es kann einige Referenzen
 * auf eine Gruppe gebem. Eine Gruppe kann auch Referenzen auf anderen Gruppen beinhalten.
 * 
 * Deswegen wird das ganze in einen eigenen Service ausgelagert.
 */
public interface IDeleteGroupService
{
    public void deleteGroup(UUID groupId) throws TechnicalGroupException, GroupNotFoundException;
}
