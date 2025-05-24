import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { INode } from "../../mod-files-data/mod-files-data.module";

import { ShowDuplicateFilesComponent } from '../components/show-duplicate-files/show-duplicate-files.component';

@Injectable({
  providedIn: 'root'
})
export class ShowDuplicateFilesService {

  /**
   * 
   * @param dialog 
   */
  constructor(private dialog: MatDialog) { 

  }

  /**
   * 
   * @param fileNames 
   * @returns 
   */
  public show(files: INode[]): Observable<number> {

    const dialogRef = this.dialog.open(ShowDuplicateFilesComponent, {
      width: '80%',
      maxWidth: '600px',
      data: files
    });
    return dialogRef.afterClosed();
  }
}
