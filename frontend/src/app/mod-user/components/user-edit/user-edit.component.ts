import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';
import { UserService } from '../../services/user.service';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

import { User } from '../../../mod-userdata/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  showEditor: boolean = false;
  user: User = User.empty();
  users: User[] = new Array<User>();
  newAvatar: File | undefined = undefined;
  profileForm: FormGroup;

  /**
   * 
   * @param formBuilder 
   * @param userSvc 
   */
  constructor(
    formBuilder: FormBuilder,
    private userSvc: UserService,
    private avatarSvc: AvatarService,
    private msgBoxSvc: CommonDialogsService) {

    this.profileForm = formBuilder.nonNullable.group(
      {
        userId: new FormControl<string>(''),
        accountName: new FormControl<string>('', [Validators.required]),
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        surname: new FormControl<string>('', [Validators.required]),
        lastname: new FormControl<string>('', [Validators.required]),
      }
    );
    this.profileForm.markAllAsTouched();
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.reload();
  }

  public reload(currentUser?: User) {

    this.showEditor = false;
    this.user = currentUser || User.empty();
    this.newAvatar = undefined;

    this.userSvc.listUsers()
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
      this.profileForm.setValue(this.user);
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
    this.profileForm.setValue(this.user);
  }

  onSubmit() {

    console.log('save user');
    const newUser = User.fromJSON(this.profileForm.value);
    this.userSvc.saveUser(newUser, this.newAvatar)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.reload(newUser);
        this.msgBoxSvc.showSnackbar('Benutzer gespeichert.');
      })
  }

  onResetForm() {
    this.profileForm.setValue(this.user);
  }
}
