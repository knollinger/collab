import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, User } from '../../../mod-userdata/mod-userdata.module';
import { ACLEntry, EACLEntryType } from '../../mod-permissions.module';
import { MatSelectChange } from '@angular/material/select';

class OwnerRecord {

  constructor(
    public readonly uuid: string,
    public readonly type: EACLEntryType,
    public readonly name: string) {

  }

  public static empty(): OwnerRecord {
    return new OwnerRecord('', EACLEntryType.NONE, '');
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
}

@Component({
  selector: 'app-aclentry-owner-selector',
  templateUrl: './aclentry-owner-selector.component.html',
  styleUrls: ['./aclentry-owner-selector.component.css'],
  standalone: false,
})
export class AclEntryOwnerSelectorComponent {

  private _users: User[] = new Array<User>();
  private _groups: Group[] = new Array<Group>();
  private _entry: ACLEntry = ACLEntry.empty();
  ownerRecords: Array<OwnerRecord> = new Array<OwnerRecord>();
  disabled: boolean = false;

  current: number = -1;

  @Input()
  label: string = '';

  @Input()
  set users(users: User[]) {
    this._users = users;
    this.createOwnerRecords();
    this.locateOwnerRecord();
  }

  /**
   * Setter für die zu verwendenden Gruppen. Es werden prinzipiell 
   * keine primaryGroups angezeigt, aus diesem grund werden diese 
   * hier heraus gefiltert.
   */
  @Input()
  set groups(groups: Group[]) {
    this._groups = groups;
    this.createOwnerRecords();
    this.locateOwnerRecord();
  }

  @Input()
  set value(entry: ACLEntry) {
    this._entry = entry;
    this.locateOwnerRecord();
  }

  get value(): ACLEntry {
    return this._entry;
  }

  @Output()
  ownerChange: EventEmitter<ACLEntry> = new EventEmitter<ACLEntry>();

  /**
   * 
   * @param evt 
   */
  onSelectionChange(evt: MatSelectChange) {


    const idx = Number.parseInt(evt.value);
    this._entry.uuid = this.ownerRecords[idx].uuid;
    this._entry.type = this.ownerRecords[idx].type;
    this.current = idx;
    this.ownerChange.emit(this._entry);
  }

  public currentOwner(): OwnerRecord {

    if (this.current === -1 || this.ownerRecords.length === 0) {
      return OwnerRecord.empty();
    }
    return this.ownerRecords[this.current];
  }

  private createOwnerRecords() {

    const owners = new Array<OwnerRecord>();

    this._users.forEach(user => {
      owners.push(new OwnerRecord(user.userId, EACLEntryType.USER, user.accountName));
    })

    this._groups.forEach(group => {
      owners.push(new OwnerRecord(group.uuid, EACLEntryType.GROUP, group.name));
    })
    this.ownerRecords = owners;
  }

  private locateOwnerRecord() {

    this.current = -1;
    for (let i = 0; i < this.ownerRecords.length; ++i) {

      const record = this.ownerRecords[i];
      if (record.uuid === this._entry.uuid && record.type === this._entry.type) {
        this.current = i;
      }
    }
  }
}
