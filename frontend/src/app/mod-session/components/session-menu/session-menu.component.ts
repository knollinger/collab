import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../../mod-user/mod-user.module';

@Component({
  selector: 'app-session-menu',
  templateUrl: './session-menu.component.html',
  styleUrls: ['./session-menu.component.css']
})
export class SessionMenuComponent implements OnInit {

  constructor(
    private userSvc: UserService,
    private sessionSvc: SessionService) {
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
      result = this.userSvc.getAvatarUrl(user);
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
    this.sessionSvc.logout().subscribe(() => {

    });
  }
}
