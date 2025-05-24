import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';
import { INode } from '../../mod-files-data/models/inode';

/**
 * WOPI...Lustiger ServiceName. 
 * 
 * Aber WOPI ist das WEB APPLICATION OPEN PLATFORM INTERFACE.
 * 
 * Dummerweise von MS, ist aber OpenSource.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class WopiService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getLauncherForm', 'wopi/createLauncherForm/{1}'],
      ['getMimeTypes', 'wopi/mimetypes']
    ]
  );

  private mimeTypeCache: string[] = new Array<string>();

  /**
   * 
   * @param backendSvc 
   * @param http 
   */
  constructor(
    private backendSvc: BackendRoutingService,
    private http: HttpClient) {

  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  public getLauncherFormUrl(inode: INode): string {
    return this.backendSvc.getRouteForName('getLauncherForm', WopiService.routes, inode.uuid);
  }

  /**
   * Liefere die (gefilterte) Liste der von Collabara unterstützten MimeTypes.
   * 
   * Die MimeTypes werden nicht permanent neu geladen sondern werden
   * gecached.
   * 
   * @returns 
   */
  public getWOPIMimeTypes(): Observable<string[]> {

    if (this.mimeTypeCache.length > 0) {
      return of(this.mimeTypeCache);
    }

    const url = this.backendSvc.getRouteForName('getMimeTypes', WopiService.routes);
    return this.http.get<string[]>(url).pipe(
      map(mimeTypes => {
        this.mimeTypeCache = mimeTypes;
        return this.mimeTypeCache;
      })
    );
  }
}
