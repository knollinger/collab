package org.knollinger.colab.filesys.services.impl;


import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.models.IPermissions;
import org.knollinger.colab.filesys.services.ICheckPermsService;
import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckPermsServiceImpl implements ICheckPermsService
{
    @Autowired()
    ICurrentUserService currUserSvc;


    /**
     * @throws AccessDeniedException 
     *
     */
    @Override
    public void checkPermission(int required, INode inode) throws AccessDeniedException
    {
        int effectivePerm = this.getEffectivePermissions(inode);
        if ((effectivePerm & required) != required)
        {
            throw new AccessDeniedException(inode);
        }
    }

    /**
     * Berechne die effektive Permission auf die INode.
     * 
     * EffectivePermission meint dabei folgendes:
     * 
     * 
     */
    public int getEffectivePermissions(INode inode)
    {
        return this.getEffectivePermissions(inode.getPerms(), inode.getOwner(), inode.getGroup());
    }


    /**
     * @param inode
     * @return
     */
    public int getEffectivePermissions(int perms, UUID ownerId, UUID groupId)
    {
        int result = this.extractWorldPerms(perms);
        if (result != IPermissions.ALL_PERMS)
        {
            TokenPayload token = this.currUserSvc.get();
            if (!token.isEmpty())
            {
                User user = token.getUser();
                if (user.getUserId().equals(ownerId))
                {
                    result |= this.extractUserPerms(perms);
                }

                if (result != IPermissions.ALL_PERMS)
                {
                    for (Group group : token.getGroups())
                    {
                        if (group.getUuid().equals(groupId))
                        {
                            result |= this.extractGroupPerms(perms);
                            break;
                        }
                    }
                }
            }
        }
        return result;

    }


    /**
     * 
     * @param inode
     * @param perms
     * @return
     */
    @Override
    public boolean hasEffectivePermissions(INode inode, int perms)
    {
        return (this.getEffectivePermissions(inode) & perms) == perms;
    }

    /**
     * Extrahiere die Benutzer-Permissions aus der CompoundPermissionMask
     * 
     * @param perms
     * @return
     */
    private int extractUserPerms(int perms)
    {
        return (perms & IPermissions.USR_PERMS_MASK) >> IPermissions.USR_PERMS_SHIFT;
    }

    /**
     * Extrahiere die Group-Permissions aus der CompoundPermissionMask
     * 
     * @param perms
     * @return
     */
    private int extractGroupPerms(int perms)
    {
        return (perms & IPermissions.GRP_PERMS_MASK) >> IPermissions.GRP_PERMS_SHIFT;
    }

    /**
     * Extrahiere die World-Permissions aus der CompoundPermissionMask
     * 
     * @param perms
     * @return
     */
    private int extractWorldPerms(int perms)
    {
        return (perms & IPermissions.WORLD_PERMS_MASK) >> IPermissions.WORLD_PERMS_SHIFT;
    }
}
