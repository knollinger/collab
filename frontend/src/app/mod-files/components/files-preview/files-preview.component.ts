import { Component, Inject, OnInit } from '@angular/core';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';
import { SpinnerService } from '../../../mod-commons/mod-commons.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContentTypeService } from '../../services/content-type.service';

export interface IFilesPreviewInput {
  current: INode,
  siblings: INode[]
}

@Component({
  selector: 'app-files-preview',
  templateUrl: './files-preview.component.html',
  styleUrls: ['./files-preview.component.css']
})
export class FilesPreviewComponent implements OnInit {

  src: string = '';

  constructor(
    private spinnerSvc: SpinnerService,
    private inodeSvc: INodeService,
    private contentTypeSvc: ContentTypeService,
    public dialogRef: MatDialogRef<FilesPreviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: IFilesPreviewInput) {

      this.activateLoading(data.current);
  }

  activateLoading(inode: INode) {

    this.spinnerSvc.setMessage(`Lade ${inode.name}`);
    this.spinnerSvc.addPendingRequest();
    this.src = this.inodeSvc.getContentUrl(inode.uuid);
  }

  /**
   * 
   */
  onLoaded() {

    this.spinnerSvc.removePendingRequest();
  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /**
   * 
   */
  ngOnDestroy(): void {

  }

  /**
   * 
   */
  public get mainType(): string {

    return this.data.current.type.split('/')[0];
  }

  /**
   * 
   */
  public get srcUrl(): string {
    return this.inodeSvc.getContentUrl(this.data.current.uuid);
  }

  getMimeTypeIcon(): string {
    return this.contentTypeSvc.getTypeIconUrl(this.data.current.type);
  }
}
