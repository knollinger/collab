package org.knollinger.colab.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;

public interface IDeleteService
{
    public void deleteINode(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException;
}
