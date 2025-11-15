import { inject } from '@angular/core';
import { SessionService } from '../../mod-session/session.module';

/**
  AccessControlLists werden an allen möglichen Resourcen verwendet. INodes, 
  Kalender-Enträge, Pinwall-PostIts, ...                                    
                                                                          
  Eine ACL besteht im wesentlichen aus einer Liste von Berechtigungen,      
  welche entweder einem Benutzer oder einer Gruppe von Benutzern erteilt    
  werden.                                                                   
                                                                          
  Die eigentlichen Permissions werden als BitMaske abgebildet. Dabei        
  existieren nur die folgenden drei Berechtigungen:                         
                                                                          
  * PERM_READ - aus der mit der ACL verbundenen Resource kann gelesen     
                werden                                                    
  * PERM_WRITE - in die mit der ACL verbundenen Resource kann geschrieben 
                 werden                                                   
  * PERM_DELETE - die mit der ACL verbundenen Resource kann gelöscht      
                  werden                                                  
                                                                          
  Zusätzlich beinhaltet eine ACL noch die UUID des Resource-Owners sowie    
  die UUID des Owner-Gruppe. Letztere ist häufig die Gruppe des Owners, dies
  ist aber nicht zwingend.         
  
  Änderungen an der ACL darf nur der Owner oder ein Mitglied der 
  OwingGroup vornehmen!

  Alle Tests in der ACL (hasPermissions, isReadable, ...) erfolgen gegen
  den aktuell angemeldeten Benutzer.
*/
export class ACL {

    private _effectivePerms: number | undefined = undefined;

    /**
     * 
     * @param ownerId 
     * @param groupId 
     * @param entries 
     */
    constructor(
        public ownerId: string,
        public groupId: string,
        private _entries: ACLEntry[]) {

        if (this.findEntryIdx(ownerId, EACLEntryType.USER) === -1) {
            this.createOrReplaceEntry(ownerId, EACLEntryType.USER, ACLEntry.PERM_NONE);
        }

        if (this.findEntryIdx(groupId, EACLEntryType.USER) === -1) {
            this.createOrReplaceEntry(groupId, EACLEntryType.GROUP, ACLEntry.PERM_NONE);
        }
    }

    public static empty(): ACL {
        return new ACL('', '', []);
    }

    public isEmpty(): boolean {
        return !this.ownerId;
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IACL): ACL {

        return new ACL(
            json.ownerId,
            json.groupId,
            json.entries.map(entry => { return ACLEntry.fromJSON(entry) }));
    }

    /**
     * Überführe die ACL in ein JSON-Serialisierbares IACL-Objekt
     * @returns 
     */
    public toJSON(): IACL {

        return {
            ownerId: this.ownerId,
            groupId: this.groupId,
            entries: this._entries.map(entry => { return entry.toJSON() })
        }
    }

    get effectivePerms(): number | undefined {
        return this._effectivePerms;
    }

    set effectivePerms(permMask: number) {
        this._effectivePerms = ACLEntry.normalizeMask(permMask);
    }

    /**
     * liefere eine DeepCopy aller Entries.
     * 
     * Die DeepCopy ist notwendig um Modifikationen an den ACL zu verhindern.
     */
    public get entries(): ACLEntry[] {
        return this._entries;
    }

    /**
     * Füge einen neuen ACLEntry in die ACL ein. Sollte bereits ein solcher
     * Eintrag existieren, so wird er überschrieben. Anderenfalls wird ein
     * neuer Eintrag in die ACL aufgenommen.
     * 
     * Diese Operation kann nur durchgeführt werden, wenn der aktuelle Benutzer
     * der Owner der ACL ist oder der Owning-Group angehört. Anderenfalls
     * resultiert das ganze in eine NOOP.
     * 
     * @param uuid 
     * @param type 
     * @param perms 
     */
    public createOrReplaceEntry(uuid: string, type: EACLEntryType, perms: number) {

        let entry = new ACLEntry(uuid, type, perms);
        const idx = this.findEntryIdx(uuid, type);
        if (idx === -1) {
            this._entries.push(entry);
        }
        else {
            this._entries[idx] = entry;
        }
        return entry;
    }

    /**
     * 
     * Entferne einen Eintrag aus der ACL.
     * 
     * @param uuid 
     * @param type 
     * @returns null, wenn kein solches Element gefunden wurde. Anderenfalls der entfernte ACLEntry.
     */
    public deleteEntry(uuid: string, type: EACLEntryType): ACLEntry | null {

        let result: ACLEntry | null = null;

        const idx = this.findEntryIdx(uuid, type);
        if (idx !== -1) {
            result = this._entries.splice(idx, 1)[0];
        }

        return result;
    }

    /**
     * finde einen Eintrag in der EntriesList anhand seiner OwnerId und seines
     * EntryTypes
     * 
     * @param uuid 
     * @param type 
     * 
     * @returns -1, wenn kein solcher ACLEntry gefunden wurde. Sonst der Index des Entries.
     */
    public findEntryIdx(uuid: string, type: EACLEntryType): number {

        for (let i = 0; i < this._entries.length; ++i) {

            const entry = this._entries[i];
            if (entry.uuid === uuid && entry.type === type) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * Die JSON-Darstellung einer ACL
 */
export interface IACL {
    ownerId: string,
    groupId: string,
    entries: IACLEntry[]
}

/**
 * ACLs beinhalten 0-n Einträge, welche entweder auf einen Benutzer oder auf 
 * eine Benutzer-Gruppe referenziert. Dieser Enum beschreibt den Referenz-Typ.
 * 
 * Die Enum-Values sind als Strings beschrieben, da diese somit automatisch
 * in der JSON-Serialisierung verwendet werden
 */
export enum EACLEntryType {
    NONE = '',
    USER = 'USER',
    GROUP = 'GROUP'
}

/**
 * Die JSON-Darstellung eines ACLEntry
 */
export interface IACLEntry {
    uuid: string,
    type: EACLEntryType,
    perms: number
}

/**
 * Beschreibt einen einzelnen ACL-Eintrag. 
 * 
 * Einem Benutzer oder einer Gruppe werden Lese-, Schreib-, Lösch-Rechte
 * eingeräumt.
 */
export class ACLEntry {

    public static readonly PERM_NONE: number = 0b000;
    public static readonly PERM_READ: number = 0b100;
    public static readonly PERM_WRITE: number = 0b010;
    public static readonly PERM_DELETE: number = 0b001;
    public static readonly PERMS_ALL: number = ACLEntry.PERM_READ | ACLEntry.PERM_WRITE | ACLEntry.PERM_DELETE;

    private _perms: number;

    /**
     * 
     * @param uuid 
     * @param type 
     * @param perms 
     */
    constructor(
        public uuid: string,
        public type: EACLEntryType,
        perms: number) {

        this._perms = ACLEntry.normalizeMask(perms)
    }

    /**
     * Transferiere das JSON-Objekt in ein ACLEntry-Objekt
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IACLEntry): ACLEntry {
        return new ACLEntry(json.uuid, json.type, ACLEntry.normalizeMask(json.perms));
    }

    /**
     * Transferiere das ACLEntry-Object in ein JSON-Object
     * @returns 
     */
    public toJSON(): IACLEntry {
        return {
            uuid: this.uuid,
            type: this.type,
            perms: this._perms
        }
    }

    public static empty(): ACLEntry {
        return new ACLEntry('', EACLEntryType.NONE, 0);
    }

    public isEmpty(): boolean {
        return this.type === EACLEntryType.NONE;
    }

    public isUser(): boolean {
        return this.type === EACLEntryType.USER;
    }

    public isGroup(): boolean {
        return this.type === EACLEntryType.GROUP;
    }

    /**
     * liefere die PermissionMask
     */
    public get permissionMask(): number {
        return this._perms;
    }

    /**
     * Hat der ACLEntry alle in der Make angegebenen Permissions?
     * 
     * @param mask 
     * @returns 
     */
    public hasPermissions(mask: number): boolean {
        const normalized = ACLEntry.normalizeMask(mask);
        return (this._perms & normalized) === normalized;
    }

    /**
     * Setze die Permissions aus der angegebenen Maske. Bestehende 
     * Permissions, welche in der Maske nicht enthalten sind bleiben 
     * dabei unverändert.
     * 
     * @param mask 
     */
    public setPermissions(mask: number) {
        this._perms |= ACLEntry.normalizeMask(mask);
    }

    /**
     * Lösche alle in der Makse angegebenen Permissions. Bestehende 
     * Permissions, welche in der Maske nicht enthalten sind bleiben 
     * dabei unverändert.
     * 
     * @param mask 
     */
    public clearPermissions(mask: number) {
        this._perms &= ~ACLEntry.normalizeMask(mask);
    }

    /**
     * 
     */
    public get readable(): boolean {
        return (this._perms & ACLEntry.PERM_READ) === ACLEntry.PERM_READ;
    }

    /**
     * 
     */
    public set readable(val: boolean) {
        if (val) {
            this.setPermissions(ACLEntry.PERM_READ);
        }
        else {
            this.clearPermissions(ACLEntry.PERM_READ);
        }
    }

    /**
     * 
     */
    public get writable(): boolean {
        return (this._perms & ACLEntry.PERM_WRITE) === ACLEntry.PERM_WRITE;
    }

    /**
     * 
     */
    public set writable(val: boolean) {

        if (val) {
            this.setPermissions(ACLEntry.PERM_WRITE);
        }
        else {
            this.clearPermissions(ACLEntry.PERM_WRITE);
        }
    }

    /**
     * 
     */
    public get deletable(): boolean {
        return (this._perms & ACLEntry.PERM_DELETE) === ACLEntry.PERM_DELETE;
    }

    /**
     * 
     */
    public set deletable(val: boolean) {
        if (val) {
            this.setPermissions(ACLEntry.PERM_DELETE);
        }
        else {
            this.clearPermissions(ACLEntry.PERM_DELETE);
        }
    }

    /**
     * Normalisiere die Permission-Maske in den Range welche
     * durch die PermBits belegt werden.
     * 
     * Die Permission-Bits belegen nur die "rechten" drei Bits 
     * einer number, Alles was "links" davon liegt wird abgeschnitten.
     * 
     * @param mask 
     * @returns 
     */
    public static normalizeMask(mask: number): number {
        return mask & ACLEntry.PERMS_ALL;
    }
}


