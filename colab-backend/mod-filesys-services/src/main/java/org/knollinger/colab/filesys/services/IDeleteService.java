package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;

public interface IDeleteService
{
    public void deleteINode(UUID uuids) throws TechnicalFileSysException, NotFoundException;
    public void deleteINode(UUID uuids, Connection conn) throws TechnicalFileSysException, NotFoundException;

    public void deleteINodes(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException;
    public void deleteINodes(List<UUID> uuids, Connection conn) throws TechnicalFileSysException, NotFoundException;
}
