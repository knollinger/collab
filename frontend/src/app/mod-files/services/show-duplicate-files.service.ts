import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

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
  public show(fileNames: string[]): Observable<number> {

    const dialogRef = this.dialog.open(ShowDuplicateFilesComponent, {
      width: '80%',
      maxWidth: '600px',
      data: fileNames
    });
    return dialogRef.afterClosed();
  }
}
