import { Component, Injectable, Type } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
}
