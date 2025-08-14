import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

/**
 * Stellt sicher, dass alle Cookies auch in den Requests des
 * HttpClients gesetzt werden
 */
@Injectable()
export class EnsureCookiesInterceptor implements HttpInterceptor {

  // TODO: Das ist Bullshit! Der nominatim-call muss an den server gesendet werden, der routet das result 1:1 durch
  private noCookiesDomains: Set<string> = new Set<string>(
    [
      'nominatim.openstreetmap.org'
    ]
  );

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

    const url = new URL(request.url);
    if (!this.noCookiesDomains.has(url.hostname)) {
      
      request = request.clone({
        withCredentials: true
      });
    }

    return next.handle(request);
  }
}
