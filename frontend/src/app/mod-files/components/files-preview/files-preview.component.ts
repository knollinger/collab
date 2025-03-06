import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContentTypeService } from '../../services/content-type.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

export interface IFilesPreviewInput {
  current: INode,
  siblings: INode[]
}

@Component({
  selector: 'app-files-preview',
  templateUrl: './files-preview.component.html',
  styleUrls: ['./files-preview.component.css']
})
export class FilesPreviewComponent implements OnInit, OnDestroy {

  currentIdx: number = 0;
  inodes: INode[] = new Array<INode>();

  private timerId: number = -1;

  /**
   * 
   * @param inodeSvc 
   * @param contentTypeSvc 
   * @param dialogRef 
   * @param data 
   */
  constructor(
    private inodeSvc: INodeService,
    private contentTypeSvc: ContentTypeService,
    public dialogRef: MatDialogRef<FilesPreviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: IFilesPreviewInput) {

    data.siblings.forEach(sibling => {
      if (!sibling.isDirectory()) {
        this.inodes.push(sibling);
      }
    });

    for (let i = 0; i < this.inodes.length; ++i) {
      if (this.inodes[i].uuid === data.current.uuid) {
        this.currentIdx = i;
        break;
      }
    }
  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  ngOnDestroy() {
    if (this.timerId != -1) {
      window.clearInterval(this.timerId);
    }
  }

  /**
   * 
   */
  onScrollLeft() {
    this.currentIdx--;
    if (this.currentIdx < 0) {
      this.currentIdx = this.inodes.length - 1;
    }
  }

  /**
   * 
   */
  onScrollRight() {
    this.currentIdx++;
    if (this.currentIdx >= this.inodes.length) {
      this.currentIdx = 0;
    }
  }

  /**
   * 
   */
  public get currentINode(): INode {
    return this.inodes[this.currentIdx];
  }

  /**
   * 
   */
  public get mainType(): string {

    return this.currentINode.type.split('/')[0];
  }

  /**
   * 
   */
  public get srcUrl(): string {
    return this.inodeSvc.getContentUrl(this.currentINode.uuid);
  }

  /**
   * 
   * @returns 
   */
  getMimeTypeIcon(): string {
    return this.contentTypeSvc.getTypeIconUrl(this.currentINode.type);
  }

  onAutoLoop(evt: MatSlideToggleChange) {

    if (evt.checked) {

      this.timerId = window.setInterval(() => {
        this.onScrollRight();
      }, 10000);
    }
    else {
      window.clearInterval(this.timerId);
      this.timerId = -1;
    }
  }
}
