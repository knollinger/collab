import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FilesPreviewComponent } from '../components/files-preview/files-preview.component';
import { INode } from '../models/inode';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  constructor(private dialog: MatDialog) {

  }

  public showPreview(
    current: INode,
    siblings: INode[]) {

    const dialogRef = this.dialog.open(FilesPreviewComponent, {
      width: '90%',
      height: '90%',
      data: {
        current: current,
        siblings: siblings
      }
    });
  }
}
