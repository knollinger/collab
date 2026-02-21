package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;

public interface IDeleteService
{
    public Collection<UUID> deleteINode(UUID uuids) throws TechnicalFileSysException, NotFoundException;
    public Collection<UUID> deleteINode(UUID uuids, Connection conn) throws TechnicalFileSysException, NotFoundException;

    public Collection<UUID> deleteINodes(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException;
    public Collection<UUID> deleteINodes(List<UUID> uuids, Connection conn) throws TechnicalFileSysException, NotFoundException;
}
