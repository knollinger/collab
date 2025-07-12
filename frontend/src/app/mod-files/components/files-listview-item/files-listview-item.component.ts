import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { ContentTypeService } from '../../services/content-type.service';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { Permissions } from '../../models/permissions';

@Component({
  selector: 'app-files-listview-item',
  templateUrl: './files-listview-item.component.html',
  styleUrls: ['./files-listview-item.component.css'],
  standalone: false
})
export class FilesListViewItemComponent implements OnInit {

  @Input()
  inode: INode = INode.empty();

  @Input()
  iconSize: number = 32;

  @Output()
  select: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  /**
   * 
   */
  get iconUrl(): string {
    return this.iconSvc.getTypeIconUrl(this.inode.type);
  }

  /**
   * 
   */
  get iconWidth(): string {
    return `${this.iconSize}px`;
  }

  /**
   * 
   */
  get isLocked(): boolean {
    return !this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode);
  }

  onSelect(evt: MouseEvent, inode: INode) {
    evt.stopPropagation();
    this.select.emit(evt.ctrlKey);
  }
}
