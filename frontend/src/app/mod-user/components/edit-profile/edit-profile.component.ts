import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageBoxService, TitlebarService } from '../../../mod-commons/mod-commons.module';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profileForm: FormGroup;
  user: User = User.empty();

  private avatar: File | undefined = undefined;

  /**
   * 
   * @param titlebarSvc 
   * @param route 
   * @param locSvc 
   * @param userSvc 
   * @param msgBoxSvc 
   * @param formBuilder 
   */
  constructor(
    private titlebarSvc: TitlebarService,
    private route: ActivatedRoute,
    private locSvc: Location,
    private userSvc: UserService,
    private msgBoxSvc: MessageBoxService,
    formBuilder: FormBuilder) {

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

    this.titlebarSvc.subTitle = 'Benutzerprofil bearbeiten';
    this.route.paramMap.subscribe(params => {

      const uuid = params.get('uuid');
      if (!uuid || uuid === User.EMPTY_USER_ID) {
        this.profileForm.setValue(this.user);
      }
      else {
        this.userSvc.getUser(uuid).subscribe(user => {
          this.user = user;
          this.profileForm.setValue(user);
        })
      }
    })
  }

  /**
   * 
   * @param file 
   */
  onAvatarChange(file: File) {
    this.avatar = file;
  }

  /**
   * 
   */
  onSubmit() {

    const user = User.fromJSON(this.profileForm.value);
    this.userSvc.saveUser(user, this.avatar).subscribe(user => {

      this.locSvc.back();
      this.msgBoxSvc.showSnackbar('Der Benutzer wurde erfolgreich gespeichert.');
    })
  }

  /**
   * 
   */
  onGoBack() {

    this.locSvc.back();
  }
}
