import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';

import { CommonDialogsService } from '../services/common-dialogs.service';
import { Router } from '@angular/router';

/**
 * Der Error-Interceptor springt bei allen HttpErrorResponses an und zeigt
 * einen Fehler mittels des **CommonDialogsService** an. 
 * 
 * Wenn im Body ein JSON-Objekt mit der eigenschafft "message" geliefert wird, 
 * so wird diese angezeigt. Anderenfalls generiert der Interceptor eine mehr
 * oder weniger schöne Meldung mit dem HTTP-Statuscode.
 * 
 * Sollte der HTTP-Status auf eine fehlende Authentifizierung hin weisen (HTTP 401)
 * so wird auf die Login-Page redirected.
 * 
 * Keinesfalls kommt die Error-Situation beim Aufrufer des Angular-HTTPClients an. 
 * Dort kann also immer vom alles-ist-prima-Fall ausgegangen werden. Im Fall des
 * Falles kommt halt aus dem HTTP-Client keine Antwort :-)
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  /**
   *
   */
  constructor(
    private router: Router,
    private msgService: CommonDialogsService) {
  }

  /**
   *
   * @param req der HttpRequest
   * @param next der nächste HttpHandler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {

        switch (err.status) {
          case 0:
            this.msgService.showErrorBox('Oooops', err.error.message);
            break;

          case 401:
            this.router.navigateByUrl(`/session/login`); // redirUrl funct hier ned, weil die gerufene URL ans backend ging!
            break;

          default:
            const httpError = {
              message: err.error.message,
              method: req.method,
              path: err.error.path,
              status: err.error.status,
              trace: err.error.trace
            }
            this.msgService.showBackendError(httpError);
            break;
        }
        return throwError(err);
      })
    );
  }

  /**
   *
   * @param err
   * @returns
   */
  private extractErrorMessage(err: HttpErrorResponse): string {

    console.log(err);
    if (err.error.message) {
      return err.error.message;
    }

    if (err.message) {
      return err.message;
    }

    if (err.status === 0) {
      return 'Die Verbindung mit dem Server konnte nicht hergestellt werden.';
    }
    return `Der Server antwortete mit dem Status-Code ${err.status}\n${err.statusText}`;
  }
}
