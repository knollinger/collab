import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';

import { User, Group, AvatarService } from '../../../mod-userdata/mod-userdata.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: false
})
export class UserEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  user: User = User.empty();
  userForm: FormGroup;
  private newAvatar: File | undefined = undefined;

  /**
   * 
   * @param route 
   */
  constructor(
    private formBuilder: FormBuilder,
    private titleBarSvc: TitlebarService,
    private route: ActivatedRoute,
    private userSvc: UserService) {

    this.userForm = this.formBuilder.nonNullable.group(
      {
        userId: new FormControl(''),
        accountName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        surname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required])
      }
    );
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titleBarSvc.subTitle = 'Benutzer-Verwaltung';
    
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['userId'];
        if (uuid) {
          this.userId = uuid;
        }
      });
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about the UserId                                                    */
  /*                                                                         */
  /* Die BenutzerId kann entweder via Router-Param oder als InputParam       */
  /* werden. Dadurch ist es möglich, die Komponente in eine andere Component */
  /* zu embedden aber auch frei stehend an das router-outlet zu binden.      */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  private _userId: string = '';

  @Input()
  public set userId(uuid: string) {

    this._userId = uuid;
    if (uuid !== User.EMPTY_USER_ID) {
      this.loadUser();
    }
  }

  public get userId(): string {
    return this._userId;
  }

  /**
   * 
   */
  private loadUser() {

    this.userSvc.getUser(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.user = user;
        this.userForm.setValue(user.toJSON());
      })
  }

  /**
   * 
   * @param avatar 
   */
  onAvatarChange(avatar: File) {

    this.newAvatar = avatar;
  }

  /**
   * 
   */
  onSubmit() {

    const user = User.fromJSON(this.userForm.getRawValue());
    this.userSvc.saveUser(user, this.newAvatar)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {

        this.user = User.fromJSON(rsp);
        this.newAvatar = undefined;
      })
  }

  /**
   * 
   */
  onResetForm() {

    this.loadUser();
  }
}
