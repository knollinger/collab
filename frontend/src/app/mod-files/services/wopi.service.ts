import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';
import { INode } from '../models/inode';

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
        this.mimeTypeCache = mimeTypes.filter(type => this.isAllowedMimeType(type));
        return this.mimeTypeCache;
      })
    );
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Einige von Collabara unterstützten MimeTypes werden ignoriert, da dafür */
  /* leichtgewichtigere Viewer/Editoren zur Verfügung stehen.                */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  private forbiddenMimeTypes: RegExp[] = [
    new RegExp("image\/.*"),
    new RegExp("text\/.*")
  ];

  /**
   * Einige MimeTypes sollen nicht durch Collabra geöffnet werden.
   * Diese werden hier ausgefiltert.
   * 
   * Die Funktion dient als Callback für einen aufruf von filter()
   * 
   * @param type 
   * @returns 
   */
  private isAllowedMimeType(type: string): boolean {

    for (let regexp of this.forbiddenMimeTypes) {
      if (type.match(regexp)) {
        return false;
      }
    }
    return true;
  }
}
