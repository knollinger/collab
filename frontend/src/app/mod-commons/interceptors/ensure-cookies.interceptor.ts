import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

/**
 * Stellt sicher, dass alle Cookies auch in den Requests des
 * HttpClients gesetzt werden
 */
@Injectable()
export class EnsureCookiesInterceptor implements HttpInterceptor {

  /**
   *
   */
  constructor() {
  }

  /**
   *
   * @param request
   * @param next
   * @returns
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      withCredentials: true
    });

    return next.handle(request);
  }
}
