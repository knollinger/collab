import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, map, of } from 'rxjs';

import { User } from '../../mod-user/mod-user.module';

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
  login(email: string, password: string, newPwd?: string): Observable<LoginResponse> {

    const url = this.backendRouter.getRouteForName('login', SessionService.routes);
    const req = new LoginRequest(email, password, newPwd);
    return this.http.post<ILoginResponse>(url, req.toJSON()).pipe(
      map(json => {
        const rsp = LoginResponse.fromJSON(json);
        this._currentUser = this.parseToken(rsp.token);
        this.startRefreshTimer();
        return rsp;
      })
    );
  }

  /**
   * 
   */
  logout(): Observable<void> {

    const url = this.backendRouter.getRouteForName('logout', SessionService.routes);
    return this.http.delete(url).pipe(
      map(() => {
        this.stopRefreshTimer();
        this.router.navigateByUrl('/session/login');
      })
    );
  }

  /**
   * liefere den aktuellen Benutzer oder User.empty() wenn kein Login vor liegt
   */
  public get currentUser(): User {

    return this._currentUser;
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  private parseToken(token: string): User {

    let user: User = User.empty();
    if (token) {

      const parts = token?.split('.');
      if (parts.length === 3) {

        const json = JSON.parse(atob(parts[1]));
        user = User.fromJSON(json.user);
      }
    }
    return user;
  }

  /**
   * 
   * @returns 
   */
  private startRefreshTimer() {

    if (!this.isRefreshTimerRunning()) {
      
      this.timerId = window.setInterval(() => {
        
        console.log('start refresh timer');
        if (this.refreshSub) {
          this.refreshSub.unsubscribe();
        }

        this.refreshSub = this.refreshToken().subscribe(user => {
          this._currentUser = user;
        })
      }, 60000);
    }
  }

  /**
   * 
   * @returns 
   */
  private refreshToken(): Observable<User> {

    const url = this.backendRouter.getRouteForName('refreshToken', SessionService.routes);
    return this.http.get<ILoginResponse>(url).pipe(
      map(rsp => {
        return this.parseToken(rsp.token);
      })
    );
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
