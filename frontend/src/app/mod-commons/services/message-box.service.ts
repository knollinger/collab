import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MessageBoxComponent } from '../components/message-box/message-box.component';

/**
 * Zeigt einen MessageBox-Dialog in den verschiedenen Ausprägungen an.
 * 
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  /**
   *
   * @param messageBox
   */
  constructor(
    private messageBox: MatDialog,
    private snackBar: MatSnackBar) {

  }

  /**
    *
    * @param msgTitle
    * @param msg
    * @returns
    */
  public showInfoBox(msgTitle: string, msg: string): Observable<boolean> {

    return this.showMsgBox(msgTitle, msg, 'info');
  }

  /**
      *
      * @param msgTitle
      * @param msg
      * @returns
      */
  public showErrorBox(msgTitle: string, msg: string): Observable<boolean> {

    return this.showMsgBox(msgTitle, msg, 'error');
  }

  /**
   *
   * @param msgTitle
   * @param msg
   * @returns
   */
  public showQueryBox(msgTitle: string, msg: string): Observable<boolean> {

    return this.showMsgBox(msgTitle, msg, 'query');
  }

  /**
   * Zeige eine Messagebox mit den gegebenen Daten an.
   * 
   * @param msgTitle
   * @param msg
   * @param type
   * @returns
   */
  private showMsgBox(msgTitle: string, msg: string, type: string): Observable<boolean> {

    const dialogRef = this.messageBox.open(MessageBoxComponent, {
      width: '80%',
      maxWidth: '600px',
      data: {
        title: msgTitle,
        msg: msg,
        type: type
      }
    });
    return dialogRef.afterClosed();
  }

  /**
   * 
   * @param msg 
   */
  public showSnackbar(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }
}
