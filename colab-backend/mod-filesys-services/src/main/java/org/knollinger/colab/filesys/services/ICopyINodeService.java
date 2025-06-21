package org.knollinger.colab.filesys.services;

import java.util.List;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;

public interface ICopyINodeService
{
    /**
     * 
     * @param inodes
     * @param target
     * @return
     * @throws TechnicalFileSysException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public List<INode> copyINodes(List<INode> inodes, INode target)
        throws TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException;
}
