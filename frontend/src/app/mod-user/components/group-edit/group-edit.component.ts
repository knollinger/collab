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

  groupTree: Group[] = new Array<Group>();
  allGroups: Group[] = new Array<Group>();
  currentMembers: Group[] = new Array<Group>();

  /**
   * 
   * @param groupSvc 
   * @param userSvc 
   */
  constructor(
    private groupSvc: GroupService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    // lese Rekursiv dem Baum aller Gruppen, auf der Root-Ebene werden
    // PrimaryGruppen ignoriert
    this.groupSvc.listGroups(true, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.groupTree = groups;
      })

    // lese die Liste aller gruppen incl der PrimärGruppen, ohne
    // jedoch einen deepScan durch zu führen
    this.groupSvc.listGroups(false, false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.allGroups = groups;
      })


  }

  /**
   * 
   */
  onCreateGroup() {


  }

  onGroupSelection(groups: Group[]) {

    if (groups.length) {
      this.currentMembers = groups[0].members;
    }
  }
}
