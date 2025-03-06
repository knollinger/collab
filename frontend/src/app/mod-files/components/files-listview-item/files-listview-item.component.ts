import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { INode } from '../../models/inode';
import { ContentTypeService } from '../../services/content-type.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-files-listview-item',
  templateUrl: './files-listview-item.component.html',
  styleUrls: ['./files-listview-item.component.css']
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
  ngOnInit(): void {
  }

  get iconUrl(): string {
    return this.iconSvc.getTypeIconUrl(this.inode.type);
  }

  get iconWidth(): string {
    return `${this.iconSize}px`;
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
