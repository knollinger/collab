import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';
import { INode } from '../models/inode';

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
   * 
   * @returns 
   */
  public getWOPIMimeTypes(): Observable<string[]> {

    const url = this.backendSvc.getRouteForName('getMimeTypes', WopiService.routes);
    return this.http.get<string[]>(url);
  }
}
