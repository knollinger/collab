import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, map, of } from 'rxjs';

import { Group, User } from '../../mod-userdata/mod-userdata.module';
import { ITokenPayload } from '../models/token-payload';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { LoginRequest } from '../models/login-request';
import { LoginResponse, ILoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['login', 'v1/session/login'],
      ['logout', 'v1/session/logout'],
      ['refreshToken', 'v1/session/refreshToken']
    ]
  );

  private _currentUser: User = User.empty();
  private _groups: Group[] = new Array<Group>();
  private timerId: number = -1;
  private refreshSub: any;

  /**
   * 
   * @param http 
   */
  constructor(
    private router: Router,
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {

  }

  /**
   * 
   * @param email 
   * @param password 
   * @param newPwd 
   * @param rememberMe 
   * @returns 
   */
  public login(email: string, password: string, keepLoggedIn: boolean, newPwd?: string): Observable<LoginResponse> {

    const url = this.backendRouter.getRouteForName('login', SessionService.routes);
    const req = new LoginRequest(email, password, keepLoggedIn, newPwd);
    return this.http.post<ILoginResponse>(url, req.toJSON()).pipe(
      map(json => {
        const rsp = LoginResponse.fromJSON(json);
        this.parseToken(rsp.token);
        this.startRefreshTimer();
        return rsp;
      })
    );
  }

  /**
   * 
   */
  public logout(): Observable<void> {

    const url = this.backendRouter.getRouteForName('logout', SessionService.routes);
    return this.http.delete(url).pipe(
      map(() => {
        this.stopRefreshTimer();
        this._currentUser = User.empty();
        this._groups = new Array<Group>();
        this.router.navigateByUrl('/session/login');
      })
    );
  }

  /**
   * 
   * @returns 
   */
  public refreshToken(): Observable<LoginResponse> {

    const url = this.backendRouter.getRouteForName('refreshToken', SessionService.routes);
    return this.http.get<ILoginResponse>(url).pipe(
      map(json => {

        const rsp = LoginResponse.fromJSON(json);
        this.parseToken(rsp.token);
        return rsp;
      })
    );
  }

  /**
   * liefere den aktuellen Benutzer oder User.empty() wenn kein Login vor liegt
   */
  public get currentUser(): User {
    return this._currentUser;
  }

  public get groups(): Group[] {
    return this._groups;
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  private parseToken(token: string) {

    if (token) {

      const parts = token?.split('.');
      if (parts.length === 3) {

        const json = JSON.parse(atob(parts[1])) as ITokenPayload;
        this._currentUser = User.fromJSON(json.user);

        const groups = new Array<Group>();
        json.groups.forEach(group => {
          groups.push(Group.fromJSON(group));
        });
        this._groups = groups;
      }
    }
  }

  /**
   * 
   * @returns 
   */
  private startRefreshTimer() {

    if (!this.isRefreshTimerRunning()) {

      this.timerId = window.setInterval(() => {

        if (this.refreshSub) {
          this.refreshSub.unsubscribe();
        }

        this.refreshSub = this.refreshToken()
          .subscribe(payload => {
            ;
          })
      }, 60000);
    }
  }

  /**
   * 
   */
  private stopRefreshTimer() {

    if (this.isRefreshTimerRunning()) {
      window.clearInterval(this.timerId);
      this.timerId = -1;
    }
  }

  /** 
   * 
   */
  private isRefreshTimerRunning(): boolean {
    return this.timerId >= 0;
  }
}
