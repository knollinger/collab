import { Injectable } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IDashboardResult, DashboardResult } from '../models/dashboard-links';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['loadDashboard', 'v1/dashboard/all']
    ]
  );
  
  /**
   * 
   * @param backendRouter 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {

  }

  public loadDashboard(): Observable<DashboardResult> {

    const url = this.backendRouter.getRouteForName('loadDashboard', DashboardService.routes);
    return this.http.get<IDashboardResult>(url)
      .pipe(map(json => DashboardResult.fromJSON(json)));
  }
}
