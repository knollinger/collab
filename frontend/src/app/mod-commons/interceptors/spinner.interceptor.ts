import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

/**
 * Der **SpinnerInterceptor** füht einfach mit Hilfe des
 * **SpinnerService** Buch über alle laufenden HTTP-Requests.
 * 
 * Bei einem Start eines Requests incrementiert er am 
 * **SpinnerService** die ANzahl offener Requests, beim Ende
 * eines Requests decrementiert er diese Anzahl.
 * 
 * Sinn und Zweck des ganzen ist es, die **SpinnerComponent*
 * zu aktivieren/deaktivieren.
 * 
 */
@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  private pendingRequests = 0;

  /*
   *
   */
  constructor(
    private spinnerService: SpinnerService) {

  }

  /**
   * Grätsche in einen HTTP-Request rein und versorge den 
   * **SpinnerService** mit der Info über laufende Requests.
   * 
   * @param request der HTTP-Request
   * @param next der nächste Interceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.spinnerService.addPendingRequest();
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.removePendingRequest();
      })
    );
  }
}
