import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { INode } from '../../models/inode';

@Component({
  selector: 'app-files-item-context-menu',
  templateUrl: './files-item-context-menu.component.html',
  styleUrls: ['./files-item-context-menu.component.css']
})
export class FilesItemContextMenuComponent {

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
}
