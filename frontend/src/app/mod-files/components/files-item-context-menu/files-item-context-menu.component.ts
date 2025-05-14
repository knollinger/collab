import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { INode } from '../../models/inode';
import { Permissions } from '../../models/permissions';

import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ClipboardService } from '../../services/clipboard.service';
import { CreateMenuService } from '../../services/create-menu.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateMenuItemGroup } from '../../models/create-menu-item';

@Component({
  selector: 'app-files-item-context-menu',
  templateUrl: './files-item-context-menu.component.html',
  styleUrls: ['./files-item-context-menu.component.css'],
  standalone: false
})
export class FilesItemContextMenuComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Input()
  inode: INode = INode.empty();

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

  triggerPosX: string = '';
  triggerPosY: string = '';
  createGroups: CreateMenuItemGroup[] = new Array<CreateMenuItemGroup>();

  /**
   * 
   * @param clipboardSvc 
   * @param checkPermsSvc 
   * @param createMenuSvc 
   */
  constructor(
    private clipboardSvc: ClipboardService,
    private checkPermsSvc: CheckPermissionsService,
    private createMenuSvc: CreateMenuService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.createMenuSvc.getMenuGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.createGroups = groups;
      })
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
