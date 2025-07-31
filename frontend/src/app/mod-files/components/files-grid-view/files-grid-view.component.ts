import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeDroppedEvent, FilesDroppedEvent } from '../../directives/drop-target.directive';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';
import { extractSelectedINodes } from '../files-frame-selector/files-frame-selector.component';
import { ShowFilesItemContextMenuEvent } from '../files-item-context-menu/files-item-context-menu.component';

/**
 * Stellt den GridView dar.
 * 
 * Der GridView ist nur eine Ansicht des durch den Parent bereit gestellten 
 * Models.
 * 
 * Alle Aktionen wie FileDrop, Open, Delete, ShowProps... werden einfach als
 * Events an den Parent (weiter-)geleitet. Dieser modifiziert dann das Model
 * was sich wiederum auf den GridView auswirkt.
 * 
 */
@Component({
  selector: 'app-files-grid-view',
  templateUrl: './files-grid-view.component.html',
  styleUrls: ['./files-grid-view.component.css'],
  standalone: false
})
export class FilesGridViewComponent implements OnInit {

  @Input()
  currentFolder: INode = INode.root();

  @Input()
  inodes: INode[] = new Array<INode>();

  /**
   * Alle selektierten INodes
   */
  @Input()
  selectedINodes: Set<INode> = new Set<INode>();

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  selectionChange: EventEmitter<Set<INode>> = new EventEmitter<Set<INode>>();

  @Input()
  iconSize: number = 64;

  @Output()
  inodesDropped: EventEmitter<INodeDroppedEvent> = new EventEmitter<INodeDroppedEvent>();

  @Output()
  filesDropped: EventEmitter<FilesDroppedEvent> = new EventEmitter<FilesDroppedEvent>();

  @Input()
  showSelectionFrame: boolean = false;

  @Output()
  selectionFrameClosed: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  showContextMenu: EventEmitter<ShowFilesItemContextMenuEvent> = new EventEmitter<ShowFilesItemContextMenuEvent>();

  /**
   * 
  */
  constructor() {

  }

  /**
   * 
   */
  ngOnInit(): void {
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
   * 
   */
  isSelected(inode: INode): boolean {
    return this.selectedINodes.has(inode);
  }

  /**
   * 
   * @param inode 
   * @param evt 
   */
  onSelect(inode: INode, isMultiSelect: boolean) {

    if (!isMultiSelect) {
      this.selectedINodes.clear();
      this.selectedINodes.add(inode);
    }
    else {
      if (this.isSelected(inode)) {
        this.selectedINodes.delete(inode);
      }
      else {
        this.selectedINodes.add(inode);
      }
    }
    this.selectionChange.emit(this.selectedINodes);
  }

  /**
   * 
   */
  onDeselectAll() {
    this.selectedINodes.clear();
    this.selectionChange.emit(this.selectedINodes);
  }

  onSelRectClose() {
    this.selectionFrameClosed.emit();
  }

  /**
   * Der SelectionFrame hat sich geändert
   * 
   * @param parent 
   * @param rect 
   */
  onSelRectChange(parent: HTMLElement, rect: DOMRect) {

    this.selectedINodes.clear();
    const selected = extractSelectedINodes(parent, rect, 'app-files-grid-view-item', this.inodes);
    selected.forEach(inode => {
      this.selectedINodes.add(inode);
    });
    this.selectionChange.emit(this.selectedINodes);
  }

  /**
   * 
   * @param idx 
   * @returns 
   */
  mustBreak(idx: number): boolean {

    return (idx > 0 && this.inodes[idx - 1].isDirectory() && !this.inodes[idx].isDirectory());
  }

  onOpen(inode: INode) {
    this.open.emit(inode);
  }

  onShowContextMenu(evt: MouseEvent, inode: INode) {

    evt.stopPropagation();
    evt.preventDefault();
    this.showContextMenu.emit(new ShowFilesItemContextMenuEvent(evt, inode));
  }
}
