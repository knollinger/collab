package org.knollinger.workingtogether.filesys.services;

import java.util.List;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;

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
    public List<INode> copyINodes(List<INode> inodes, INode target) throws TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException;
}
