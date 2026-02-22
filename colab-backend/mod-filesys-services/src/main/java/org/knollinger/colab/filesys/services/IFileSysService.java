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
     */
    public INode getINode(UUID uuid)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

    /**
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException 
     */
    public INode getINode(UUID uuid, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;

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
     * @param uuid
     * @param name
     * @param conn
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public void rename(UUID uuid, String name, Connection conn)
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
     * 
     * @param parentId
     * @param name
     * @param contentType
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public INode createDocument(UUID parentId, String name, String contentType, Connection conn)
        throws TechnicalFileSysException, NotFoundException, DuplicateEntryException, AccessDeniedException;

    /**
     * @param parentId
     * @param name
     * @return
     * @throws AccessDeniedException
     * @throws NotFoundException
     * @throws TechnicalFileSysException
     * @throws DuplicateEntryException
     */
    INode getOrCreateFolder(UUID parentId, String name)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException;

    /**
     * @param parentId
     * @param name
     * @param conn
     * @return
     * @throws AccessDeniedException
     * @throws NotFoundException
     * @throws TechnicalFileSysException
     * @throws DuplicateEntryException
     */
    INode getOrCreateFolder(UUID parentId, String name, Connection conn)
        throws AccessDeniedException, NotFoundException, TechnicalFileSysException;
}
