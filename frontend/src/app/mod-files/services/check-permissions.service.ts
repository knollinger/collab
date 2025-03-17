import { Injectable } from '@angular/core';

import { Permissions } from '../models/permissions';
import { INode } from '../models/inode';

import { SessionService } from '../../mod-session/services/session.service';
import { Group } from '../../mod-userdata/mod-userdata.module';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  public constructor(private sessionSvc: SessionService) {

  }

  public hasPermissions(perms: number, inode: INode): boolean {

    let result: boolean = false;

    const user = this.sessionSvc.currentUser;
    if (!user.isEmpty()) {

      result = this.checkUserPerms(user.userId, perms, inode);
      if (!result) {

        const groups = this.sessionSvc.groups;
        result = this.checkGroupPerms(groups, perms, inode);
        if (!result) {

          result = this.checkWorldPerms(perms, inode);
        }
      }
    }
    return result;
  }

  /**
   * 
   * @param userId 
   * @param perms 
   * @param inode 
   * @returns 
   */
  private checkUserPerms(userId: string, perms: number, inode: INode): boolean {

    let result: boolean = false;
    if (userId === inode.owner) {
      const val = (inode.perms & Permissions.USR_PERMS_MASK) >> Permissions.USR_PERMS_SHIFT;
      result = (val & perms) === perms;
    }
    return result;
  }

  /**
   * 
   * @param groups 
   * @param perms 
   * @param inode 
   */
  private checkGroupPerms(groups: Group[], perms: number, inode: INode): boolean {

    let result: boolean = false;

    // Zuerst wird getestet ob eine evtl Gruppenzugehörigkeit die Berechtigungen hat
    // Das ist billig, eine Iteration über alle Gruppen kostet ein wenig mehr
    const val = (inode.perms & Permissions.GRP_PERMS_MASK) >> Permissions.GRP_PERMS_SHIFT;
    const groupAllowed = (val & perms) === perms;

    if (groupAllowed) {

      // Ok, prinzipiell ist der Zugriff für Gruppen-Member erlaubt. Wir testen
      // jetzt, ob der aktuelle Benutzer der Gruppe für die INode angehört.
      for (let g of groups) {

        if (g.uuid === inode.group) {
          result = true;
          break;
        }
      }
    }

    return result;
  }

  /**
   * 
   * @param perms 
   * @param inode 
   * @returns 
   */
  private checkWorldPerms(perms: number, inode: INode): boolean {

    const val = (inode.perms & Permissions.WORLD_PERMS_MASK) >> Permissions.WORLD_PERMS_SHIFT;
    return (val & perms) === perms;
  }
}
