import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonDialogsService, TitlebarService } from '../../../mod-commons/mod-commons.module';
import { UserService } from '../../services/user.service';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

import { User } from '../../../mod-userdata/models/user';

@Component({
  selector: 'app-main-user-edit',
  templateUrl: './user-main-edit.component.html',
  styleUrls: ['./user-main-edit.component.css'],
  standalone: false
})
export class UserMainEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  showEditor: boolean = false;
  user: User = User.empty();
  users: User[] = new Array<User>();
  newAvatar: File | undefined = undefined;

  /**
   * 
   * @param formBuilder 
   * @param userSvc 
   */
  constructor(
    formBuilder: FormBuilder,
    private titleBarSvc: TitlebarService,
    private userSvc: UserService,
    private avatarSvc: AvatarService,
    private msgBoxSvc: CommonDialogsService) {
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = 'Benutzer-Verwaltung';
    this.reload();
  }

  public reload(currentUser?: User) {

    this.showEditor = false;
    this.user = currentUser || User.empty();
    this.newAvatar = undefined;

    this.userSvc.getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;
      });
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  getAvatar(user: User): string {
    return this.avatarSvc.getAvatarUrl(user.userId);
  }

  onUserSelection(users: User[]) {

    if (users && users.length) {

      this.user = users[0];
      this.newAvatar = undefined;
      this.showEditor = true;
    }
  }

  isUserSelected(): boolean {
    return !this.user.isEmpty();
  }

  onAvatarChange(avatar: File) {

    this.newAvatar = avatar;
  }

  onCreateUser() {
    this.user = User.empty();
    this.newAvatar = undefined;
    this.showEditor = true;
  }

  onDeleteUser() {

    const msg = `Möchtest Du wirklich den Benutzer ${this.user.accountName} löschen?<br>Es werden alle Dateien, Termine, ... gelöscht!`;
    this.msgBoxSvc.showQueryBox('Bist Du sicher?', msg)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {

        if(rsp) {

          this.userSvc.delUser(this.user)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(_ => {
              this.reload();
              alert('user deleted');
            })
        }
      });

  }
}
