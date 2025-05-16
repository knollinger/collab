import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ContentTypeService } from '../../services/content-type.service';

import { INode } from '../../models/inode';
import { FilesDroppedEvent, INodeDroppedEvent } from '../../directives/drop-target.directive';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';

@Component({
  selector: 'app-files-list-view',
  templateUrl: './files-list-view.component.html',
  styleUrls: ['./files-list-view.component.css'],
  standalone: false
})
export class FilesListViewComponent implements OnInit {

  @Input()
  inodes: INode[] = new Array<INode>();

  @Input()
  iconSize: number = 32;

  @Input()
  selectedINodes: Set<INode> = new Set<INode>();

  @Output()
  selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);


  @Output()
  inodesDropped: EventEmitter<INodeDroppedEvent> = new EventEmitter<INodeDroppedEvent>();

  @Output()
  filesDropped: EventEmitter<FilesDroppedEvent> = new EventEmitter<FilesDroppedEvent>();

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
   * @param contentTypeSvc 
   */
  constructor(private contentTypeSvc: ContentTypeService) { }

  /**
   * 
   */
  ngOnInit(): void {
  }

  /** 
     * 
     */
  isSelected(inode: INode): boolean {
    return this.selectedINodes.has(inode);
  }

  /**
   * 
   * @param inode 
   * @param selected 
   */
  onItemSelectionChange(inode: INode, selected: boolean) {

    if (selected) {
      this.selectedINodes.add(inode);
    }
    else {
      this.selectedINodes.delete(inode);
    }
  }

  /**
    * Auf eines der GridView-Items wurde ein FileDrop durchgeführt.
    * Das behandeln wir hier nicht sondern geben das einfach an den
    * Parent weiter.
    * 
    */
  onFilesDropped(event: FilesDroppedEvent) {

    this.filesDropped.emit(event);
  }

  /**
   * Auf eines der GridView-Items wurde ein InodeDrop durchgeführt.
   * Das behandeln wir hier nicht sondern geben das einfach an den
   * Parent weiter.
   * 
   * @param files 
   */
  onINodesDropped(event: INodeDroppedEvent) {
    this.inodesDropped.emit(event);
  }


  /**
   * An einem GridViewItem wurde ein open() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onOpen(inode: INode) {
    console.log(`onOpen: ${inode}`);
    this.open.emit(inode);
  }

  onCreate(evt: CreateMenuEvent) {
    this.create.emit(evt);
  }

  /**
   * An einem GridViewItem wurde ein rename() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onRename(inode: INode) {
    this.rename.emit(inode);
  }

  /**
   * An einem GridViewItem wurde ein delete() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onDelete(inode: INode) {
    this.delete.emit(inode);
  }

  /**
   * An einem GridViewItem wurde ein cut() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onCut(inode: INode) {
    this.cut.emit(inode);
  }

  /**
   * An einem GridViewItem wurde ein copy() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onCopy(inode: INode) {
    this.copy.emit(inode);
  }

  /**
   * An einem GridViewItem wurde ein paste() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onPaste(inode: INode) {
    this.paste.emit(inode);
  }

  /**
   * An einem GridViewItem wurde ein showProps() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onShowProps(inode: INode) {
    this.showProps.emit(inode);
  }
}
