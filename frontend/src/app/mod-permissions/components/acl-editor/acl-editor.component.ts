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

  onAddACLEntry() {
    const entry = ACLEntry.empty();
    this.otherACLEntries.push(entry);
    // this._acl. // TODO: in die ACL einfügen!
    this.aclChanged.next(this._acl);
  }

  onDeleteEntry(idx: number) {
    this.otherACLEntries.splice(idx, 1);
    //    this.aclChanged.next(this._acl); // TODO: die acl updaten
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
