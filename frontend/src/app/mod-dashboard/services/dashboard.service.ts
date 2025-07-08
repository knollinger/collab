import { Component, Injectable, Type } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IDashboardWidgetDescriptor, DashboardWidgetDescriptor } from '../models/dashboard-widget-descriptor';
import { WidgetTypeRegistryService } from './widget-type-registry.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['loadWidgets', 'v1/dashboard/widgets'],
      ['addWidget', 'v1/dashboard/widgets?typeName={1}'],
      ['deleteWidget', 'v1/dashboard/widgets?widgetId={1}']
    ]
  );

  /**
   * 
   * @param http 
   * @param backendRouter 
   * @param typeRegistry 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService,
    private typeRegistry: WidgetTypeRegistryService) {

  }

  /**
   * 
   * @returns Lade alle Widgets aus dem Backend
   */
  public loadWidgets(): Observable<DashboardWidgetDescriptor[]> {

    const url = this.backendRouter.getRouteForName('loadWidgets', DashboardService.routes);
    return this.http.get<IDashboardWidgetDescriptor[]>(url)
      .pipe(map(descs => {
        return descs.map(desc => DashboardWidgetDescriptor.fromJSON(desc, this.typeRegistry));
      }));
  }

  /**
   * 
   * @param typeName 
   * @returns 
   */
  public addWidget(typeName: string): Observable<DashboardWidgetDescriptor> {

    const url = this.backendRouter.getRouteForName('addWidget', DashboardService.routes, typeName);
    return this.http.put<IDashboardWidgetDescriptor>(url, null)
      .pipe(map(desc => {
        return DashboardWidgetDescriptor.fromJSON(desc, this.typeRegistry);
      }))
  }

  /**
   * 
   * @param widgetId 
   * @returns 
   */
  public deleteWidget(widgetId: string): Observable<void> {

    const url = this.backendRouter.getRouteForName('deleteWidget', DashboardService.routes, widgetId);
    return this.http.delete<void>(url);
  }
}
