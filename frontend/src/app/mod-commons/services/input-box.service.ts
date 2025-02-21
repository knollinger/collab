import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { InputBoxComponent } from '../components/input-box/input-box.component';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class InputBoxService {

  /**
   * 
   * @param dialog 
   */
  constructor(private dialog: MatDialog) {

  }

  /** 
   * 
   */
  public showInputBox(title: string, placeholder: string, value?: string): Observable<string> {

    const dialogRef = this.dialog.open(InputBoxComponent, {
      width: '80%',
      maxWidth: '600px',
      data: {
        title: title,
        placeholder: placeholder,
        value: value || ''
      }
    });
    return dialogRef.afterClosed();
  }
}
