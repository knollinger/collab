import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

import { ISearchResult, SearchResult } from '../models/search-result';
import { SearchRequest } from '../models/search-request';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['search', 'v1/search']
    ]);

  /**
   * 
   * @param backendRouter 
   * @param httpClient 
   */
  constructor(
    private backendRouter: BackendRoutingService,
    private httpClient: HttpClient) {

  }

  /**
   * 
   * @param search 
   */
  public search(search: string): Observable<SearchResult> {

    const url = this.backendRouter.getRouteForName('search', SearchService.routes);
    const req = new SearchRequest(search);

    return this.httpClient.post<ISearchResult>(url, req.toJSON()).pipe(
      map(json => {
        return SearchResult.fromJSON(json);
      })
    );
  }
}
