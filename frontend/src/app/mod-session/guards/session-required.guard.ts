import { SessionService } from './../services/session.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionRequiredGuard implements CanActivate {

  /**
   *
   * @param sessionService
   */
  constructor(
    private router: Router,
    private sessionService: SessionService) {
  }

  /**
     * @param next
     * @param state
     * @returns
     */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.sessionService.currentUser.isEmpty()) {
      const url = `/session/login?redirUrl=${state.url}`;
      this.router.navigateByUrl(url);
      return false;
    }
    return true;
  }
}
