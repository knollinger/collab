import { Component, EventEmitter, Input, Output } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ContentTypeService } from '../../services/content-type.service';

import { Permissions } from '../../models/permissions';

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

  @Output()
  select: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * 
   * @param iconSvc 
   */
  constructor(
    private iconSvc: ContentTypeService,
    private checkPermsSvc: CheckPermissionsService) {
  }

  get iconUrl() {
    return `url("${this.iconSvc.getTypeIconUrl(this.inode.type)}"`;
  }

  get iconWidth(): string {
    return `${this.iconSize}px`;
  }

  get isLocked(): boolean {
    return !this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode);
  }

  get isLink(): boolean {
    return this.inode.isLink();
  }

  get linkIcon() {
    return this.iconSvc.getTypeIconUrl('inode/link');
  }

  onSelect(evt: MouseEvent, inode: INode) {
    evt.stopPropagation();
    this.select.emit(evt.ctrlKey);
  }
}
