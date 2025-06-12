import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { ContentTypeService } from '../../services/content-type.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { FilesItemContextMenuComponent } from '../files-item-context-menu/files-item-context-menu.component';
import { Permissions } from '../../models/permissions';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';

@Component({
  selector: 'app-files-listview-item',
  templateUrl: './files-listview-item.component.html',
  styleUrls: ['./files-listview-item.component.css'],
  standalone: false
})
export class FilesListviewItemComponent implements OnInit {

  @Input()
  inode: INode = INode.empty();

  @Input()
  iconSize: number = 32;

  /**
   * 
   * @param iconSvc 
   */
  constructor(
    private iconSvc: ContentTypeService,
    private checkPermsSvc: CheckPermissionsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  /**
   * 
   */
  get iconUrl(): string {
    return this.iconSvc.getTypeIconUrl(this.inode.type);
  }

  /**
   * 
   */
  get iconWidth(): string {
    return `${this.iconSize}px`;
  }

  /**
   * 
   */
  get isLocked(): boolean {
    return !this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode);
  }
}
