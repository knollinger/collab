import { Component, DestroyRef, inject, Inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';
import { HashTagService } from '../../../mod-hashtags/mod-hashtags.module';

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

  private newHashTags: string[] | null = null;

  disableSaveBtn: boolean = true;

  /**
   * 
   * @param data 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FilesPropertiesDialogData,
    public dialogRef: MatDialogRef<FilesPropertiesDialogComponent>,
    private inodeSvc: INodeService,
    private hashTagSvc: HashTagService) {

    this.inode = data.inode;
    this.disableSaveBtn = true;
  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  /**
   * 
   * @param tags 
   */
  onHashTagChange(tags: string[]) {

    this.newHashTags = tags;
    this.disableSaveBtn = false;
  }

  onSave() {
    this.inodeSvc.update(this.inode) //
      .pipe(takeUntilDestroyed(this.destroyRef)) //
      .subscribe(inode => {

        if (!this.newHashTags) {
          this.dialogRef.close(inode);
        }
        else {
          this.hashTagSvc.saveHashTags(this.inode.uuid, this.newHashTags)
            .pipe(takeUntilDestroyed(this.destroyRef)) //
            .subscribe(_ => {
              this.dialogRef.close(inode);
            })
        }

      })
  }
}

