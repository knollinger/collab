import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

import { User } from '../../../mod-userdata/models/user';
import { MatSelectionListChange } from '@angular/material/list';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

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
    private avatarSvc: AvatarService) {

    this.profileForm = formBuilder.group(
      {
        userId: new FormControl(''),
        accountName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        surname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
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

  private reload(currentUser?: User) {

    this.user = currentUser || User.empty();
    this.newAvatar = undefined;

    this.userSvc.listUsers().subscribe(users => {
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
    this.userSvc.saveUser(newUser, this.newAvatar).subscribe(user => {
      this.reload(newUser);
    })
  }

  onResetForm() {
    this.profileForm.setValue(this.user);
  }
}
