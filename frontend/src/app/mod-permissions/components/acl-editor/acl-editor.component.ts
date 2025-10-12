import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GroupService, UserService } from '../../../mod-user/mod-user.module';
import { Group, User } from '../../../mod-userdata/mod-userdata.module';
import { ACL, ACLEntry, EACLEntryType } from '../../mod-permissions.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-acl-editor',
  templateUrl: './acl-editor.component.html',
  styleUrls: ['./acl-editor.component.css']
})
export class AclEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private _acl: ACL = ACL.empty();

  users: User[] = new Array<User>();
  groups: Group[] = new Array<Group>();
  ownerACLEntry: ACLEntry = ACLEntry.empty();
  groupACLEntry: ACLEntry = ACLEntry.empty();
  otherACLEntries: ACLEntry[] = new Array<ACLEntry>();

  unassignedUsers: User[] = new Array<User>();
  unassignedGroups: Group[] = new Array<Group>();

  @Output()
  aclChanged: EventEmitter<ACL> = new EventEmitter<ACL>();

  /**
   * 
   * @param userSvc 
   * @param groupSvc 
   * @param avatarSvc 
   */
  constructor(
    private userSvc: UserService,
    private groupSvc: GroupService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.userSvc.getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;

        this.groupSvc.listGroups()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(groups => {
            this.groups = groups;

            this.filterUsers();
            this.filterGroups();
          })
      })
  }

  /**
   * 
   */
  @Input()
  set acl(acl: ACL) {

    this._acl = acl;

    const otherEntries = new Array<ACLEntry>();
    for (let entry of acl.entries) {

      if (entry.uuid === acl.ownerId && entry.type === EACLEntryType.USER) {
        this.ownerACLEntry = entry;
      }
      else {
        if (entry.uuid === acl.groupId && entry.type === EACLEntryType.GROUP) {
          this.groupACLEntry = entry;
        }
        else {
          otherEntries.push(entry);
        }
      }
    }
    this.otherACLEntries = otherEntries;
  }

  public getOwnerName(entry: ACLEntry): string {

    let result = '';

    switch (entry.type) {
      case EACLEntryType.USER:
        result = this.getUserName(entry.uuid);
        break;

      case EACLEntryType.GROUP:
        result = this.getGroupName(entry.uuid);
        break;

      default:
        break;
    }
    return result;
  }

  /**
   * Filtere alle Gruppen ddahingehend, das bereits zugewiesene Gruppen
   * nicht mehr im ResultSet enthalten sind
   */
  private filterUsers() {

    const result = this.users.filter(user => {
      return this._acl.findEntryIdx(user.userId, EACLEntryType.USER) === -1;
    });
    this.unassignedUsers = result;
  }

  /**
   * Filtere alle Gruppen ddahingehend, das bereits zugewiesene Gruppen
   * nicht mehr im ResultSet enthalten sind
   */
  private filterGroups() {

    const result = this.groups.filter(group => {
      return this._acl.findEntryIdx(group.uuid, EACLEntryType.GROUP) === -1;
    });
    this.unassignedGroups = result;
  }

  onACLEntryOwnerChange(entry: ACLEntry) {
    this.filterUsers();
    this.filterGroups();
  }

  private getUserName(uuid: string): string {

    for (let user of this.users) {
      if (user.userId === uuid) {
        return user.accountName;
      }
    }

    return '';
  }

  private getGroupName(uuid: string): string {

    for (let group of this.groups) {
      if (group.uuid === uuid) {
        return group.name;
      }
    }
    return '';
  }

  onAddACLEntry() {
    const entry = this._acl.createOrReplaceEntry('', EACLEntryType.NONE, 0);
    this.otherACLEntries.push(entry);
    this.aclChanged.next(this._acl);
  }

  containsEmptyEntries(): boolean {

    for (let entry of this._acl.entries) {
      if(entry.isEmpty()) {
        return true;
      }
    }
    return false;
  }

  onDeleteEntry(idx: number) {
    const entry = this.otherACLEntries[idx];
    this.otherACLEntries.splice(idx, 1);
    this._acl.deleteEntry(entry.uuid, entry.type);
    this.filterUsers();
    this.filterGroups();
    this.aclChanged.next(this._acl);

  }

  onChangeReadable(entry: ACLEntry, evt: MatCheckboxChange) {
    entry.readable = evt.checked;
    this.aclChanged.next(this._acl);

  }

  onChangeWritable(entry: ACLEntry, evt: MatCheckboxChange) {
    entry.writable = evt.checked;
    this.aclChanged.next(this._acl);
  }

  onChangeDeletable(entry: ACLEntry, evt: MatCheckboxChange) {
    entry.deletable = evt.checked;
    this.aclChanged.next(this._acl);
  }
}
