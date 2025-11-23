import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { InputBoxComponent } from '../components/input-box/input-box.component';
import { BackendErrorComponent, IBackendError } from '../components/backend-error/backend-error.component';


@Injectable({
  providedIn: 'root'
})
export class CommonDialogsService {

  /**
   * 
   * @param dialog 
   * @param snackBar 
   */
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {

  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about message boxes                                                 */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

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

    const dialogRef = this.dialog.open(MessageBoxComponent, {
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

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about input boxes                                                   */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

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

  /**
   * 
   * @param error 
   * @returns 
   */
  public showBackendError(error: IBackendError) {

    const dialogRef = this.dialog.open(BackendErrorComponent, {
      width: '80%',
      maxWidth: '800px',
      data: error
    });
    return dialogRef.afterClosed();
  }
}
