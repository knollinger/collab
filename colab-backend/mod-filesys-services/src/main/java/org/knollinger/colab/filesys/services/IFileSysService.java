package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;

public interface IFileSysService
{

    /**
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public INode getINode(UUID uuid, int reqPerm)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    /**
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public INode getINode(UUID uuid, int reqPerm, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    /**
     * 
     * @param parentId
     * @param foldersOnly
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public List<INode> getAllChilds(UUID parentId, int reqPerms, boolean foldersOnly)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    /**
     * @param parentId
     * @param name
     * @param reqPerms
     * @return
     * @throws NotFoundException
     * @throws TechnicalFileSysException
     * @throws AccessDeniedException 
     */
    public INode getChildByName(UUID parentId, String name, int reqPerms) throws NotFoundException, TechnicalFileSysException, AccessDeniedException;

    /**
     * @param parentId
     * @param name
     * @param reqPerms
     * @param conn
     * @return
     * @throws AccessDeniedException
     * @throws NotFoundException
     * @throws TechnicalFileSysException
     */
    public INode getChildByName(UUID parentId, String name, int reqPerms, Connection conn)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException;

    /**
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
    public void rename(UUID uuid, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

    /**
     * 
     * @param src
     * @param target
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public void move(List<INode> src, INode target)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

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
    public INode createFolder(UUID parentId, String name)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

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
    public INode createFolder(UUID parentId, String name, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

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
    public INode createDocument(UUID parentId, String name, String contentType)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

    /**
     * @param inode
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public INode updateINode(INode inode) throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
}
