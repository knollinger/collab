import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { INode } from '../../models/inode';
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

  @Input()
  selected: boolean = false;

  @Output()
  selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  create: EventEmitter<CreateMenuEvent> = new EventEmitter<CreateMenuEvent>();

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
  ngOnInit(): void {
  }

  get iconUrl(): string {
    return this.iconSvc.getTypeIconUrl(this.inode.type);
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

  /**
   * 
   */
  onCreate(evt: CreateMenuEvent) {
    this.create.emit(evt);
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
