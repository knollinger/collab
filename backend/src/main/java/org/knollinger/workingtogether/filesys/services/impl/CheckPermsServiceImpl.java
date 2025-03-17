package org.knollinger.workingtogether.filesys.services.impl;

import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.models.IPermissions;
import org.knollinger.workingtogether.filesys.services.ICheckPermsService;
import org.knollinger.workingtogether.user.models.EWellknownUserIDs;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.models.TokenPayload;
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
    public void hasPermission(int perm, INode inode) throws AccessDeniedException
    {
        boolean result = false;

        TokenPayload token = this.currUserSvc.get();
        if (!token.isEmpty())
        {
            result = this.checkUserPerms(token, perm, inode);
            if (!result)
            {
                result = this.checkGroupPerms(token, perm, inode);
                if (!result)
                {
                    result = this.checkWorldPerms(perm, inode);
                }
            }
        }

        if (!result)
        {
            throw new AccessDeniedException(inode);
        }
    }

    /**
     * Root darf immer alles!
     * 
     * @param token
     * @param perm
     * @param inode
     * @return
     */
    private boolean checkUserPerms(TokenPayload token, int perm, INode inode)
    {
        UUID userId = token.getUser().getUserId();
        boolean result = userId.equals(EWellknownUserIDs.ROOT.value());

        if (!result)
        {
            if (userId.equals(inode.getOwner()))
            {
                int val = (inode.getPerms() & IPermissions.USR_PERMS_MASK) >> IPermissions.USR_PERMS_SHIFT;
                result = (val & perm) == perm;
            }
        }
        return result;
    }

    /**
     * @param token
     * @param perm
     * @param inode
     * @return
     */
    private boolean checkGroupPerms(TokenPayload token, int perm, INode inode)
    {
        for (Group g : token.getGroups())
        {
            if (g.getUuid().equals(inode.getGroup()))
            {
                int val = (inode.getPerms() & IPermissions.GRP_PERMS_MASK) >> IPermissions.GRP_PERMS_SHIFT;
                return (val & perm) == perm;
            }
        }
        return false;
    }

    /**
     * @param perm
     * @param inode
     * @return
     */
    private boolean checkWorldPerms(int perm, INode inode)
    {
        int val = (inode.getPerms() & IPermissions.WORLD_PERMS_MASK) >> IPermissions.WORLD_PERMS_SHIFT;
        return (val & perm) == perm;
    }
}
