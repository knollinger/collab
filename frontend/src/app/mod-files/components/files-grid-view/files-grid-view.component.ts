import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeDroppedEvent, FilesDroppedEvent } from '../../directives/drop-target.directive';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';
import { extractSelectedINodes } from '../files-frame-selector/files-frame-selector.component';

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

  @Input()
  iconSize: number = 64;

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
  sendToDashboard: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  showProps: EventEmitter<INode> = new EventEmitter<INode>();

  @Input()
  showSelectionFrame: boolean = false;

  @Output()
  selectionFrameClosed: EventEmitter<void> = new EventEmitter<void>();

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

    // evt.stopPropagation();

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
  }

  /**
   * 
   */
  onDeselectAll() {
    this.selectedINodes.clear();
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
  }

  /**
   * An einem GridViewItem wurde ein open() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onOpen(inode: INode) {
    this.open.emit(inode);
  }

  /**
   * 
   * @param evt 
   */
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
   * 
   * @param inode 
   */
  onSendToDashboard(inode: INode) {
    this.sendToDashboard.emit(inode);
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

  mustBreak(idx: number): boolean {

    return (idx > 0 && this.inodes[idx - 1].isDirectory() && !this.inodes[idx].isDirectory());
  }
}
