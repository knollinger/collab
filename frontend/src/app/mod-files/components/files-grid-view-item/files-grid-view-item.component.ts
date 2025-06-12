import { Component, EventEmitter, Input, Output } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ContentTypeService } from '../../services/content-type.service';
import { FilesItemContextMenuComponent } from '../files-item-context-menu/files-item-context-menu.component';

import { Permissions } from '../../models/permissions';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';

/**
 * 
 */
@Component({
  selector: 'app-files-grid-view-item',
  templateUrl: './files-grid-view-item.component.html',
  styleUrls: ['./files-grid-view-item.component.css'],
  standalone: false
})
export class FilesGridViewItemComponent {

  @Input()
  inode: INode = INode.empty();

  @Input()
  iconSize: number = 64;

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
  get iconUrl(): string {
    return this.iconSvc.getTypeIconUrl(this.inode.type);
  }

  get iconUrl1() {
    return `url("${this.iconSvc.getTypeIconUrl(this.inode.type)}"`;
  }

  get iconWidth(): string {
    return `${this.iconSize}px`;
  }

  get isLocked(): boolean {
    return !this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode);
  }
}
