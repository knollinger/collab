import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { CommonDialogsService } from '../services/common-dialogs.service';
import { Router } from '@angular/router';
import { BackendErrorDesc, ShowBackendErrorService } from '../services/show-backend-error.service';

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
    private showBackendErrSvc: ShowBackendErrorService) {
  }

  /**
   *
   * @param req der HttpRequest
   * @param next der nächste HttpHandler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {

        const error = err.error;

        switch (err.status) {

          case 401:
            this.router.navigateByUrl(`/session/login`);
            break;

          case 0:
            this.showBackendErrSvc.showBackendError(new BackendErrorDesc(error.status, 'conn refused', error.path, 'Server down', ''));
            break;

          default:
            const errorDesc = new BackendErrorDesc(error.status, error.error, error.path, error.message, error.trace);
            this.showBackendErrSvc.showBackendError(errorDesc);
            break;
        }
        return throwError(err);
      })
    );
  }
}
