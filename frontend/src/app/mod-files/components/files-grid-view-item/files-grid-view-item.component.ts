import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { ContentTypeService } from '../../services/content-type.service';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { FilesItemContextMenuComponent } from '../files-item-context-menu/files-item-context-menu.component';

import { INode } from '../../models/inode';
import { Permissions } from '../../models/permissions';


/**
 * 
 */
@Component({
  selector: 'app-files-grid-view-item',
  templateUrl: './files-grid-view-item.component.html',
  styleUrls: ['./files-grid-view-item.component.css']
})
export class FilesGridViewItemComponent {

  @Input()
  inode: INode = INode.empty();

  @Input()
  iconSize: number = 64;

  @Input()
  selected: boolean = false;

  @Output()
  selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  rename: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  delete: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  cut: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  copy: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  paste: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  showProps: EventEmitter<INode> = new EventEmitter<INode>();

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

  /**
   * 
   * @param evt 
   */
  onContextMenu(evt: MouseEvent, menu: FilesItemContextMenuComponent) {
    evt.stopPropagation();
    evt.preventDefault();

    if (this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode)) {
      menu.show(evt);
    }
  }

  /**
   * 
   * @param evt 
   */
  onSelectorChange(evt: MatCheckboxChange) {
    this.selectionChange.emit(evt.checked);
  }

  /**
   * 
   */
  onOpen() {
    if (this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode)) {
      this.open.emit(this.inode);
    }
  }

  onRename() {
    this.rename.emit(this.inode);
  }

  onDelete() {
    this.delete.emit(this.inode);
  }

  onCut() {
    this.cut.emit(this.inode);
  }

  onCopy() {
    this.copy.emit(this.inode);
  }

  onPaste() {
    this.paste.emit(this.inode);
  }

  onShowProps() {
    this.showProps.emit(this.inode);
  }
}
