import { Injectable } from '@angular/core';
import { Observable, map, last } from 'rxjs';

import { IUser, User } from '../models/user';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['listUsers', 'v1/user/list'],
      ['getUser', 'v1/user/get/{1}'],
      ['saveUser', 'v1/user/save'],
      ['getAvatar', 'v1/user/avatar/{1}']
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
   * @param uuid 
   */
  getUser(uuid: string): Observable<User> {

    const url = this.backendRouter.getRouteForName('getUser', UserService.routes, uuid);
    return this.http.get<IUser>(url).pipe(
      map(json => {
        return User.fromJSON(json);
      })
    );
  }

  /** 
   * 
   */
  saveUser(user: User, avatar?: File): Observable<User> {

    const form = new FormData();
    form.append('uuid', user.userId);
    form.append('accountName', user.accountName);
    form.append('surname', user.surname);
    form.append('lastname', user.lastname);
    form.append('email', user.email);
    if (avatar) {
      form.append('avatar', avatar);
    }

    const url = this.backendRouter.getRouteForName('saveUser', UserService.routes);
    const req = new HttpRequest('POST', url, form);
    const res = this.http.request(req).pipe(
      last());

    return (res as Observable<HttpResponse<IUser>>).pipe(map(val => {

      const json = val.body as IUser;
      return User.fromJSON(json);
    }));
  }

  /**
   * 
   * @returns 
   */
  listUsers(): Observable<User[]> {

    const url = this.backendRouter.getRouteForName('listUsers', UserService.routes);
    return this.http.get<IUser[]>(url).pipe(
      map(users => {
        return users.map(user => {
          return User.fromJSON(user);
        })
      })
    );
  }

  getAvatarUrl(userId: string): string {
    return this.backendRouter.getRouteForName('getAvatar', UserService.routes, userId);

  }
}
