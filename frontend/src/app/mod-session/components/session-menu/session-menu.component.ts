import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SessionService } from '../../services/session.service';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

@Component({
  selector: 'app-session-menu',
  templateUrl: './session-menu.component.html',
  styleUrls: ['./session-menu.component.css']
})
export class SessionMenuComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  constructor(
    private sessionSvc: SessionService,
    private avatarSvc: AvatarService) {
  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  /**
   * 
   */
  get isLoggedIn(): boolean {
    return !this.sessionSvc.currentUser.isEmpty();
  }

  /**
   * 
   */
  get userName(): string {

    let result = '';
    const user = this.sessionSvc.currentUser;
    if (user) {
      result = `${user.surname} ${user.lastname}`;
    }
    return result;
  }

  get avatarUrl(): string {

    let result = '';
    const user = this.sessionSvc.currentUser;
    if (user) {
      result = this.avatarSvc.getAvatarUrl(user.userId);
    }
    return result;
  }

  /**
   * 
   */
  get userId(): string {

    return this.sessionSvc.currentUser ? this.sessionSvc.currentUser.userId : '';
  }

  /**
   * 
   */
  onLogout() {
    this.sessionSvc.logout()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
    });
  }
}
