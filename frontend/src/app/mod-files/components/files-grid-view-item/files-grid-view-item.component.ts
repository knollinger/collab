import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ContentTypeService } from '../../services/content-type.service';

import { INode } from '../../models/inode';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';

/**
 * 
 */
@Component({
  selector: 'app-files-grid-view-item',
  templateUrl: './files-grid-view-item.component.html',
  styleUrls: ['./files-grid-view-item.component.css']
})
export class FilesGridViewItemComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;
  
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
    private iconSvc: ContentTypeService) {
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
  
  /**
   * 
   * @param evt 
   */
  onContextMenu(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    if (this.trigger) {
      this.trigger.openMenu();
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
    this.open.emit(this.inode);
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
