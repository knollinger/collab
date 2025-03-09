import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Group, User } from '../../../mod-userdata/mod-userdata.module';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  groups: Group[] = new Array<Group>();
  allUsers: User[] = new Array<User>();

  /**
   * 
   * @param groupSvc 
   * @param userSvc 
   */
  constructor(
    private groupSvc: GroupService,
    private userSvc: UserService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.groupSvc.listGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.groups = groups;
      })

    this.userSvc.listUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.allUsers = users;
      })

  }

  /**
   * 
   */
  onCreateGroup() {


  }

  /**
   * 
   * @returns 
   */
  isGroupSelected(): boolean {
    return false;
  }
}
