import { Injectable } from '@angular/core';
import { SessionService } from '../../mod-session/session.module';
import { ACL, ACLEntry } from '../mod-permissions.module';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  /**
   * 
   * @param sessionSvc 
   */
  constructor(private sessionSvc: SessionService) {

  }

  /**
   * Hatt der aktuelle Benutzer die angeforderten Berechtigungen?
   * 
   * @param acl 
   * @param reqPerms 
   * @returns 
   */
  public hasPermissions(acl: ACL, reqPerms: number): boolean {

    // Falls noch nicht geschehen, berechne die effectivePerms der ACL
    if (!acl.effectivePerms) {
      acl.effectivePerms = this.calcEffectivePerms(acl);
    }

    const normalized = ACLEntry.normalizeMask(reqPerms);
    return (normalized & acl.effectivePerms) === normalized;
  }

  /**
   * 
   * @param acl 
   * @returns 
   */
  private calcEffectivePerms(acl: ACL) {

    // Konstruiere ein Set aus allen UUIDs der Gruppen des aktuellen
    // Benutzers und seiner eigenen UUID.
    const allUUIDS: Set<string> = new Set<string>();
    this.sessionSvc.groups.forEach(group => {
      allUUIDS.add(group.uuid);
    });
    allUUIDS.add(this.sessionSvc.currentUser.userId);

    let result: number = 0;
    acl.entries.forEach(entry => {

      if (allUUIDS.has(entry.uuid)) {
        result |= entry.permissionMask;
      }
    })
    return result;
  }
}
