import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, takeUntil } from 'rxjs';

import { IUser, User } from '../../mod-userdata/models/user';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

/**
 * Alle CRUD-Ops rund um die Benutzer
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['allUsers', 'v1/users/all'],
      ['createUser', 'v1/users/user'],
      ['readUser', 'v1/users/user/{1}'],
      ['updateUser', 'v1/users/user'],
      ['deleteUser', 'v1/users/user/{1}'],
      ['searchUsers', 'v1/users/search?search={1}'],
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
   * @returns Alle Benutzer enumerieren
   */
  public getAllUsers(): Observable<User[]> {

    const url = this.backendRouter.getRouteForName('allUsers', UserService.routes);
    return this.http.get<IUser[]>(url)
      .pipe(map(json => {
        return json.map(user => {
          return User.fromJSON(user);
        })
      }));
  }

  /**
   * 
   * @param user Einen Benutzer erzeugen
   * 
   * @param avatar 
   * @returns 
   */
  public createUser(user: User): Observable<User> {

    const url = this.backendRouter.getRouteForName('createUser', UserService.routes);
    return this.http.put<IUser>(url, user.toJSON())
      .pipe(map(json => {

        const user = User.fromJSON(json);
        return user;
      }));
  }

  /**
   * 
   * @param userId Einen Benutzer lesen
   * 
   * @returns 
   */
  public readUser(userId: string): Observable<User> {

    const url = this.backendRouter.getRouteForName('readUser', UserService.routes, userId);
    return this.http.get<IUser>(url)
      .pipe(map(json => {
        return User.fromJSON(json);
      }));
  }

  /**
   * Einen Benutzer ändern
   * 
   * @param user 
   * @returns 
   */
  public updateUser(user: User): Observable<User> {

    const url = this.backendRouter.getRouteForName('updateUser', UserService.routes);
    return this.http.post<IUser>(url, user.toJSON())
      .pipe(map(json => {
        return User.fromJSON(json);
      }));
  }

  /**
   * 
   * @param user Einen Benutzer löschen
   * 
   * @returns 
   */
  public delUser(user: User): Observable<void> {

    const url = this.backendRouter.getRouteForName('deleteUser', UserService.routes, user.userId);
    return this.http.delete<void>(url);
  }

  /**
   * Nach Benutzern suchen
   * 
   * @param search 
   * @returns 
   */
  public searchUsers(search: string): Observable<User[]> {

    const url = this.backendRouter.getRouteForName('searchUsers', UserService.routes, search);
    return this.http.get<IUser[]>(url)
      .pipe(map(users => {
        return users.map(user => {
          return User.fromJSON(user);
        })
      }));
  }
}
