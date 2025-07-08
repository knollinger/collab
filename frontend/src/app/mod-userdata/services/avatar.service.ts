import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getAvatar', 'v1/users/avatar/{1}'],
      ['delAvatar', 'v1/users/avatar/{1}'],
      ['updateAvatar', 'v1/users/avatar']
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

  /**
   * 
   * @param userId 
   * @returns 
   */
  getAvatarUrl(userId: string): string {
    return this.backendRouter.getRouteForName('getAvatar', AvatarService.routes, userId);
  }

  /**
   * 
   * @param userId 
   * @param avatar 
   * @returns 
   */
  updateAvatar(userId: string, avatar: Blob): Observable<void> {

    const url = this.backendRouter.getRouteForName('updateAvatar', AvatarService.routes);

    const form = new FormData();
    form.append('userId', userId);
    form.append('avatar', avatar);
    return this.http.post<void>(url, form);
  }

  /**
   * 
   * @param userId 
   * @returns 
   */
  deleteAvatar(userId: string): Observable<void> {

    const url = this.backendRouter.getRouteForName('delAvatar', AvatarService.routes, userId);
    return this.http.delete<void>(url);
  }
}
