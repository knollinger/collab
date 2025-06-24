package org.knollinger.colab.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;

public interface IPlacesService
{
    public List<INode> getPlaces(UUID userId) throws TechnicalFileSysException;

    public void deletePlace(UUID userId, UUID inodeId) throws TechnicalFileSysException;

    public void addPlaces(UUID userId, List<INode> nodes) throws TechnicalFileSysException, DuplicateEntryException;
}
