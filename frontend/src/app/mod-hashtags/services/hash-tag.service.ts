import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SaveHashtagsReq } from '../models/save-hashtags-req';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class HashTagService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getAll', 'v1/hashtags'],
      ['getByResourceId', 'v1/hashtags/{1}'],
      ['save', 'v1/hashtags'],
    ]
  );

  /**
   * 
   * @param backendRouterSvc 
   */
  constructor(
    private backendRouterSvc: BackendRoutingService,
    private http: HttpClient) {

  }

  /**
   * 
   * @returns 
   */
  public getAllHashTags(): Observable<string[]> {

    const url = this.backendRouterSvc.getRouteForName('getAll', HashTagService.routes);
    return this.http.get<string[]>(url);
  }

  /**
   * 
   * @returns 
   */
  public getHashTagsByResourceId(resId: string): Observable<string[]> {

    const url = this.backendRouterSvc.getRouteForName('getByResourceId', HashTagService.routes, resId);
    return this.http.get<string[]>(url);
  }

  /**
   * 
   * @param resId 
   * @param tags 
   * @returns 
   */
  public saveHashTags(resId: string, type: string, tags: string[]): Observable<void> {

    const url = this.backendRouterSvc.getRouteForName('save', HashTagService.routes);
    const req = new SaveHashtagsReq(resId, type, tags);
    return this.http.post<void>(url, req);
  }
}
