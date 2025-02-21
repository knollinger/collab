import { Injectable } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getIcon', 'v1/contenttype/{1}/{2}']
    ]
  );

  /**
   * 
   * @param backendRoutingSvc 
   */
  constructor(
    private backendRoutingSvc: BackendRoutingService) {
  }

  /**
   * 
   * @param type 
   * @returns 
   */
  public getTypeIconUrl(type: string): string {

    const parts = type.split('/');
    return this.backendRoutingSvc.getRouteForName('getIcon', ContentTypeService.routes, parts[0], parts[1]);
  }
}
