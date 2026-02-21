package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;

public interface ILinkINodeService
{
    /**
     * Löse einen Link (ggf recursiv) auf und liefere das eigentliche Inode-Objekt
     * 
     * @param inode
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException
     */
    public INode resolveLink(INode inode) 
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    
    /**
     * Löse einen Link (ggf recursiv) auf und liefere das eigentliche Inode-Objekt
     * 
     * @param inode
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException
     */
    public INode resolveLink(INode inode, Connection conn) 
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    /**
     * Löse einen Link (ggf recursiv) auf und liefere das eigentliche Inode-Objekt
     * 
     * @param uuid
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException
     */
    public INode resolveLink(UUID uuid) 
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    
    /**
     * Löse einen Link (ggf recursiv) auf und liefere das eigentliche Inode-Objekt
     * 
     * @param uuid
     * @param conn
     * @return
     * @throws TechnicalFileSysException
     * @throws NotFoundException
     * @throws AccessDeniedException
     */
    public INode resolveLink(UUID uuid, Connection conn) 
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
    
    /**
     * 
     * @param inodes
     * @param target
     * @return
     * @throws TechnicalFileSysException
     * @throws DuplicateEntryException
     * @throws AccessDeniedException 
     */
    public List<INode> linkINodes(List<INode> inodes, INode target)
        throws TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException;
}
