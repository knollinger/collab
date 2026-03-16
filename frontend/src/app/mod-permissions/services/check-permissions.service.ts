import { Injectable } from '@angular/core';
import { SessionService } from '../../mod-session/session.module';
import { ACL, ACLEntry } from '../mod-permissions.module';

/**
 * Der *CheckPermissionsService* dient der Berechnung der effektiven Permissions
 * des aktuellen Benutzers für eine ACL.
 * 
 * Die Berechnung selbst ist trivial. Für die Benutzer-UUID und die UUIDs aller
 * seiner Gruppen werden die Einträge der ACL durchlaufen. Wenn ein UUID-Match
 * auftritt, so werden die Permissions des entsprechenden Entries zur effektiven
 * Permission hinzu gefügt.
 * 
 * Das ganze kann aber schnell teuer werden. Wenn in einem FileFolder tausende
 * INodes angezeigt werden sollen und der aktuelle Benutzer vielen Gruppen 
 * angehört so steigt der Aufwand schnell an.
 * 
 * Aus diesem Grund wird intern eine WeakMap als Cache verwendet. Schlüssel ist
 * dxas ACL-Objekt (bzw die Referenz auf diese), als Wert wird die berechnete
 * effectivePerm gespeichert.
 * 
 * Wird später das ACL-Objekt garbage collected, so wird der Eintrag auch aus 
 * der WeakMap entfernt. Dies passiert automatisch.
 */
@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  private openACLs = new WeakMap();

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

    let effectivePerms: number;
    if (this.openACLs.has(acl)) {
      effectivePerms = this.openACLs.get(acl);
    }
    else {
      effectivePerms = this.calcEffectivePerms(acl);
      this.openACLs.set(acl, effectivePerms);
    }

    const normalized = ACLEntry.normalizeMask(reqPerms);
    return (normalized & effectivePerms) === normalized;
  }

  /**
   * Darf der aktuelle Benutzer auf das durch die ACL geschützte Objekt
   * lesend zugreifen?
   * 
   * @param acl 
   * @returns 
   */
  public canEffectiveRead(acl: ACL): boolean {

    return this.hasPermissions(acl, ACLEntry.PERM_READ);
  }

  /**
   * Darf der aktuelle Benutzer auf das durch die ACL geschützte Objekt
   * schreibend zugreifen?
   * 
   * @param acl 
   * @returns 
   */
  public canEffectiveWrite(acl: ACL): boolean {

    return this.hasPermissions(acl, ACLEntry.PERM_WRITE);
  }

  /**
   * Darf der aktuelle Benutzer das durch die ACL geschützte Objekt
   * löschen?
   * 
   * @param acl 
   * @returns 
   */
  public canEffectiveDelete(acl: ACL): boolean {

    return this.hasPermissions(acl, ACLEntry.PERM_DELETE);
  }

  /**
   * Berechne die effektiven Permissions für den aktuellen Benutzer
   * Dazu werden die Permissions des aktuellen Benutzers mit den
   * Permissions aller seiner Gruppen OR-verknüft.
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
