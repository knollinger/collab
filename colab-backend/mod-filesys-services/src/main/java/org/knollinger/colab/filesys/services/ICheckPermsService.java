package org.knollinger.colab.filesys.services;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.models.INode;

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
