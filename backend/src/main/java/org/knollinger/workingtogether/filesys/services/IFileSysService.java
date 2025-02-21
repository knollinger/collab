package org.knollinger.workingtogether.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;

public interface IFileSysService {

    public INode getINode(UUID uuid) throws TechnicalFileSysException, NotFoundException;
    public List<INode> getAllChilds(UUID parentId, boolean foldersOnly) throws TechnicalFileSysException, NotFoundException;
    public List<INode> getPath(UUID uuid) throws TechnicalFileSysException, NotFoundException;
    public void rename(UUID uuid, String name) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException;
    public INode createFolder(UUID parentId, String name) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException;
    
    public void move(List<INode> src, INode target) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException;
}
