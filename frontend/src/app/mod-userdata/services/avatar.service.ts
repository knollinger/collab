import { Injectable } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getAvatar', 'v1/user/avatar/{1}']
    ]
  );

  /**
   * 
   * @param backendRouter 
   */
  constructor(private backendRouter: BackendRoutingService) {

  }

  /**
   * 
   * @param userId 
   * @returns 
   */
  getAvatarUrl(userId: string): string {
    return this.backendRouter.getRouteForName('getAvatar', AvatarService.routes, userId);
  }
}
