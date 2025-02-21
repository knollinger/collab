package org.knollinger.workingtogether.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;

public interface IDeleteService
{
    public void deleteINode(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException;
}
