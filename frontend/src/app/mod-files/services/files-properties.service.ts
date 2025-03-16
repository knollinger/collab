import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { FilesPropertiesDialogComponent } from '../components/files-properties-dialog/files-properties-dialog.component';

import { INode } from '../models/inode';

@Injectable({
  providedIn: 'root'
})
export class FilesPropertiesService {

  /**
   * 
   * @param dialog 
   */
  constructor(private dialog: MatDialog) {

  }

  /**
   * 
   * @param inode 
   */
  public showPropDialog(inode: INode): Observable<INode> {

    const dlgRef = this.dialog.open(FilesPropertiesDialogComponent, {
      data: {
        inode: inode,
      },
    });

    return  dlgRef.afterClosed();
  }
}
