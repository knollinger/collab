package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;

public interface IListFolderService
{
    public List<INode> getAllChilds(INode parent)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    public List<INode> getAllChilds(INode parent, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    public List<INode> getAllChilds(UUID parentId)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    public List<INode> getAllChilds(UUID parentId, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
}
