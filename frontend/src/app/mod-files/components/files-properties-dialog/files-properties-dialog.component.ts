import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { INode } from "../../../mod-files-data/mod-files-data.module";

/**
 * 
 */
export interface FilesPropertiesDialogData {
  inode: INode;
  hashTags: string[],
}

/**
 * 
 */
@Component({
  selector: 'app-files-properties-dialog',
  templateUrl: './files-properties-dialog.component.html',
  styleUrls: ['./files-properties-dialog.component.css'],
  standalone: false
})
export class FilesPropertiesDialogComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private _inode: INode = INode.empty();
  private _hashTags: string[] = new Array<string>();

  disableSaveBtn: boolean = true;

  /**
   * 
   * @param data 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FilesPropertiesDialogData,
    public dialogRef: MatDialogRef<FilesPropertiesDialogComponent>) {

    this.inode = data.inode;
    this.hashTags = data.hashTags;
    this.disableSaveBtn = true;
  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  /**
   * 
   */
  set inode(val: INode) {
    this._inode = val;
    this.disableSaveBtn = false;
  }

  /**
   * 
   */
  get inode(): INode {
    return this._inode;
  }

  /**
   * 
   */
  set hashTags(tags: string[]) {
    this._hashTags = tags;
    this.disableSaveBtn = false;
  }
  
  /**
   * 
   */
  get hashTags(): string[] {
    return this._hashTags;
  }
  
  /**
   * 
   */
  onSave() {

    const result = {
      inode: this.inode,
      hashTags: this.hashTags
    }
    this.dialogRef.close(result);
  }
}