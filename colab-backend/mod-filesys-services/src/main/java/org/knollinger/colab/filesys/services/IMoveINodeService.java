package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.List;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;

/**
 * 
 */
public interface IMoveINodeService
{
    public List<INode> moveINodes(List<INode> toMove, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

    public List<INode> moveINodes(List<INode> toMove, INode target, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;
}
