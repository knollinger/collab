import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ContentTypeService } from '../../services/content-type.service';

import { INode } from '../../models/inode';

/**
 * 
 */
export interface FilesPropertiesDialogData {
  inode: INode;
}

/**
 * 
 */
@Component({
  selector: 'app-files-properties-dialog',
  templateUrl: './files-properties-dialog.component.html',
  styleUrls: ['./files-properties-dialog.component.css']
})
export class FilesPropertiesDialogComponent implements OnInit {

  /**
   * 
   * @param data 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FilesPropertiesDialogData,
  private contentTypeSvc: ContentTypeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  get icon(): string {
    return this.contentTypeSvc.getTypeIconUrl(this.data.inode.type);
  }
}

/**
 * 
 */
@Component({
  selector: 'app-files-properties-commons',
  templateUrl: './files-properties-commons.component.html',
  styleUrls: ['./files-properties-commons.component.css']
})
export class FilesPropertiesCommonsComponent implements OnInit {

  @Input()
  inode: INode = INode.empty();

  /**
   * 
   * @param data 
   */
  constructor() {
  }

  /**
   * 
   */
  ngOnInit(): void {
  }
}


