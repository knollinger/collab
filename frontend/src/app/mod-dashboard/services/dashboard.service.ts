import { Injectable } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
   * 
   * @param backendRouter 
   */
  constructor(private backendRouter: BackendRoutingService) {

  }
}
