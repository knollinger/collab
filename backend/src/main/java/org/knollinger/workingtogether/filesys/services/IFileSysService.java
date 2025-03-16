package org.knollinger.workingtogether.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;

public interface IFileSysService {

    /**
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    public INode getINode(UUID uuid) throws TechnicalFileSysException, NotFoundException;
    
    /**
     * 
     * @param parentId
     * @param foldersOnly
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    public List<INode> getAllChilds(UUID parentId, boolean foldersOnly) throws TechnicalFileSysException, NotFoundException;
    
    /**
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    public List<INode> getPath(UUID uuid) throws TechnicalFileSysException, NotFoundException;
    
    /**
     * 
     * @param uuid
     * @param name
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     */
    public void rename(UUID uuid, String name) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException;
    
    /**
     * 
     * @param src
     * @param target
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     */
    public void move(List<INode> src, INode target) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException;
    
    /**
     * 
     * @param parentId
     * @param name
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     */
    public INode createFolder(UUID parentId, String name) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException;

    /**
     * @param inode
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     */
    public INode updateINode(INode inode) throws TechnicalFileSysException, NotFoundException;
}
