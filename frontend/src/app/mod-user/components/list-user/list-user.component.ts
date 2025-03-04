import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  users: User[] = new Array<User>();

  /**
   * 
   * @param userSvc 
   */
  constructor(
    private router: Router,
    private titlebarSvc: TitlebarService,
    private userSvc: UserService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titlebarSvc.subTitle = 'Benutzer-Verwaltung';
    this.userSvc.listUsers().subscribe(users => {
      this.users = users;
    })
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  getProfileEditorUrl(user: User) {

    return `/user/editProfile/${user.userId}`;
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  getEmptyUserProfileEditorUrl() {

    return this.getProfileEditorUrl(User.empty());
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  getAvatar(user: User): string {

    return this.userSvc.getAvatarUrl(user.userId);
  }
}
