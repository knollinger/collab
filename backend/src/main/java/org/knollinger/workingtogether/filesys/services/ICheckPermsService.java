package org.knollinger.workingtogether.filesys.services;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.models.INode;

public interface ICheckPermsService
{
    /**
     * @param inode
     * @return
     */
    public int getEffectivePermissions(INode inode);

    /**
     * 
     * @param perms
     * @param target
     */
    public void checkPermission(int perms, INode target) throws AccessDeniedException;
}
