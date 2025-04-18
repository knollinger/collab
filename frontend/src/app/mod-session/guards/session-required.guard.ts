import { SessionService } from './../services/session.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionRequiredGuard  {

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
      const url = `/init?redirUrl=${state.url}`;
      console.log(url);
      this.router.navigateByUrl(url);
      return false;
    }
    return true;
  }
}
