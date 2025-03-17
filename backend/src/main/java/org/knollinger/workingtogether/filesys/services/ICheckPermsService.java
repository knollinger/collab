package org.knollinger.workingtogether.filesys.services;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.models.INode;

public interface ICheckPermsService
{
    /**
     * @param perm
     * @param node
     * @return
     * @throws AccessDeniedException 
     */
    public void hasPermission(int perm, INode node) throws AccessDeniedException;
}
