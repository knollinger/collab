package org.knollinger.workingtogether.filesys.services.impl;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.models.IPermissions;
import org.knollinger.workingtogether.filesys.services.ICheckPermsService;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.models.TokenPayload;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.ICurrentUserService;
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
        int inodePerms = inode.getPerms();

        int result = this.extractWorldPerms(inodePerms);
        if (result != IPermissions.ALL_PERMS)
        {
            TokenPayload token = this.currUserSvc.get();
            if (!token.isEmpty())
            {
                User user = token.getUser();
                if (user.getUserId().equals(inode.getOwner()))
                {
                    result |= this.extractUserPerms(inodePerms);
                }

                if (result != IPermissions.ALL_PERMS)
                {
                    for (Group group : token.getGroups())
                    {
                        if (group.getUuid().equals(inode.getGroup()))
                        {
                            result |= this.extractGroupPerms(inodePerms);
                            break;
                        }
                    }
                }
            }
        }
        return result;
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
