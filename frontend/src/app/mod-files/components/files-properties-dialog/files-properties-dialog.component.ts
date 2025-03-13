import { Component, DestroyRef, inject, Inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ContentTypeService } from '../../services/content-type.service';
import { Group, User } from '../../../mod-userdata/mod-userdata.module';
import { GroupService, UserService } from '../../../mod-user/mod-user.module';

import { INode } from '../../models/inode';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * 
 */
export interface FilesPropertiesDialogData {
  inode: INode;
}

/**
 * 
 */
@Component({
  selector: 'app-files-properties-dialog',
  templateUrl: './files-properties-dialog.component.html',
  styleUrls: ['./files-properties-dialog.component.css']
})
export class FilesPropertiesDialogComponent implements OnInit {

  /**
   * 
   * @param data 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FilesPropertiesDialogData,
    private contentTypeSvc: ContentTypeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  get icon(): string {
    return this.contentTypeSvc.getTypeIconUrl(this.data.inode.type);
  }
}

/**
 * 
 */
@Component({
  selector: 'app-files-properties-commons',
  templateUrl: './files-properties-commons.component.html',
  styleUrls: ['./files-properties-commons.component.css']
})
export class FilesPropertiesCommonsComponent implements OnInit {

  @Input()
  inode: INode = INode.empty();

  /**
   * 
   * @param data 
   */
  constructor() {
  }

  /**
   * 
   */
  ngOnInit(): void {
  }
}

/**
 * 
 */
@Component({
  selector: 'app-files-properties-permissions',
  templateUrl: './files-properties-permissions.component.html',
  styleUrls: ['./files-properties-permissions.component.css']
})
export class FilesPropertiesPermissionsComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private groupsByUUID: Map<string, Group> = new Map<string, Group>();
  allGroups: Group[] = new Array<Group>();

  @Input()
  inode: INode = INode.empty();

  propsForm: FormGroup;

  /**
   * 
   * @param data 
   */
  constructor(
    formBuilder: FormBuilder,
    private userSvc: UserService, //
    private groupSvc: GroupService) {

    this.propsForm = formBuilder.group({
      owner: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required])
    });
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.groupSvc.listGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {

        this.groupsByUUID = new Map<string, Group>();
        this.allGroups = groups;
        groups.forEach(group => {
          this.groupsByUUID.set(group.uuid, group);
        });

        this.propsForm.value.owner = this.inode.owner;
        this.propsForm.value.group = this.inode.group;
      })
  }

  get userName(): string {

    const group = this.groupsByUUID.get(this.inode.owner);
    if (group) {
      return group.name;
    }
    return '';
  }

  get groupName(): string {
    const group = this.groupsByUUID.get(this.inode.group);
    if (group) {
      return group.name;
    }
    return '';
  }
}


