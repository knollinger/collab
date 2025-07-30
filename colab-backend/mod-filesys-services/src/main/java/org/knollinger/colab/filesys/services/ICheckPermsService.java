package org.knollinger.colab.filesys.services;

import java.util.UUID;

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
     * @param inode
     * @return
     */
    public int getEffectivePermissions(int perms, UUID owner, UUID group);

    /**
     * 
     * @param perms
     * @param target
     */
    public void checkPermission(int perms, INode target) throws AccessDeniedException;

    /**
     * 
     * @param inode
     * @param perms
     * @return
     */
    boolean hasEffectivePermissions(INode inode, int perms);
}
