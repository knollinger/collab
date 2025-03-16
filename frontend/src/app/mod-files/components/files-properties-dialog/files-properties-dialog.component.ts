import { Component, DestroyRef, inject, Inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';

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

  private destroyRef = inject(DestroyRef);

  private _inode: INode = INode.empty();

  set inode(val: INode) {
    this._inode = val;
    this.disableSaveBtn = false;
  }

  get inode(): INode {
    return this._inode;
  }

  disableSaveBtn: boolean = true;

  /**
   * 
   * @param data 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FilesPropertiesDialogData,
    public dialogRef: MatDialogRef<FilesPropertiesDialogComponent>,
    private inodeSvc: INodeService) {

    this.inode = data.inode;
    this.disableSaveBtn = true;
  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  onSave() {
    this.inodeSvc.update(this.inode) //
      .pipe(takeUntilDestroyed(this.destroyRef)) //
      .subscribe(inode => {
        this.dialogRef.close(inode);
      })
  }
}

