import { Injectable } from '@angular/core';

import { INode } from '../models/inode';

import { SessionService } from '../../mod-session/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  /**
   * 
   * @param sessionSvc 
   */
  public constructor(private sessionSvc: SessionService) {

  }

  /**
   * 
   * @param perms 
   * @param inode 
   * @returns 
   */
  public hasPermissions(perms: number, inode: INode): boolean {

    return ((inode.effectivePerms & perms) === perms) ||
      this.sessionSvc.currentUser.isRoot();
  }
}
