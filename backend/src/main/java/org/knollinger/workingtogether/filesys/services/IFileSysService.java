package org.knollinger.workingtogether.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
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
     * @throws AccessDeniedException 
     */
    public INode getINode(UUID uuid, int reqPerm) throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    /**
     * 
     * @param parentId
     * @param foldersOnly
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public List<INode> getAllChilds(UUID parentId, boolean foldersOnly) throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    /**
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public List<INode> getPath(UUID uuid) throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    /**
     * 
     * @param uuid
     * @param name
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public void rename(UUID uuid, String name) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;
    
    /**
     * 
     * @param src
     * @param target
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public void move(List<INode> src, INode target) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;
    
    /**
     * 
     * @param parentId
     * @param name
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public INode createFolder(UUID parentId, String name) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;
    
    /**
     * 
     * @param parentId
     * @param name
     * @param contentType
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public INode createDocument(UUID parentId, String name, String contentType) throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

    /**
     * @param inode
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public INode updateINode(INode inode) throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
}
