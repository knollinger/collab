import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { INode } from '../../models/inode';
import { Permissions } from '../../models/permissions';

import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';

import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ClipboardService } from '../../services/clipboard.service';

@Component({
  selector: 'app-files-item-context-menu',
  templateUrl: './files-item-context-menu.component.html',
  styleUrls: ['./files-item-context-menu.component.css'],
  standalone: false
})
export class FilesItemContextMenuComponent implements OnInit {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Input()
  inode: INode = INode.empty();

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

  triggerPosX: string = '';
  triggerPosY: string = '';

  /**
   * 
   * @param clipboardSvc 
   * @param checkPermsSvc 
   * @param createMenuSvc 
   */
  constructor(
    private clipboardSvc: ClipboardService,
    private checkPermsSvc: CheckPermissionsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /**
   * 
   * @param evt 
   */
  show(evt: MouseEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.trigger) {

      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;

      this.trigger.openMenu();
    }
  }

  /**
   * 
   */
  onOpen() {
    this.open.emit(this.inode);
  }

  /**
   * 
   * @param evt 
   */
  onCreateDocument(evt: CreateMenuEvent) {
    this.create.emit(evt);
  }

  /**
   * 
   */
  onRename() {
    this.rename.emit(this.inode);
  }

  /**
   * 
   */
  onDelete() {
    this.delete.emit(this.inode);
  }

  /**
   * 
   */
  onCut() {
    this.cut.emit(this.inode);
  }

  /**
   * 
   */
  onCopy() {
    this.copy.emit(this.inode);
  }

  /**
   * 
   */
  onPaste() {
    this.paste.emit(this.inode);
  }

  /**
   * 
   */
  onShowProps() {
    this.showProps.emit(this.inode);
  }


  get isReadAllowed(): boolean {

    return this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode);
  }

  get isWriteAllowed(): boolean {

    return this.checkPermsSvc.hasPermissions(Permissions.WRITE, this.inode);
  }

  get isDeleteAllowed(): boolean {

    return this.checkPermsSvc.hasPermissions(Permissions.DELETE, this.inode);
  }

  get isPasteEnabled(): boolean {
    return !this.clipboardSvc.isEmpty && this.isWriteAllowed;
  }
}
