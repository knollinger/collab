import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';

import { User, Group, AvatarService } from '../../../mod-userdata/mod-userdata.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: false
})
export class UserEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  user: User = User.empty();
  allGroups: Group[] = new Array<Group>();
  selectedGroups: Group[] = new Array<Group>();

  userForm: FormGroup;
  private newAvatar: File | null = null;

  /**
   * 
   * @param route 
   */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private groupSvc: GroupService,
    private avatarSvc: AvatarService) {

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

    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['userId'];
        if (uuid) {
          this.userId = uuid;
        }
      });

    this.groupSvc.listGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.allGroups = groups.filter(group => {
          return !group.primary;
        });
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
        this.userForm.get('userId')?.setValue(this.userId);
        this.userForm.get('accountName')?.setValue(user.accountName);
        this.userForm.get('email')?.setValue(user.email);
        this.userForm.get('surname')?.setValue(user.surname);
        this.userForm.get('lastname')?.setValue(user.lastname);

        this.groupSvc.groupsByUser(this.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(groups => {

            this.selectedGroups = groups;
          });
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

  }

  /**
   * 
   */
  onResetForm() {

    this.loadUser();
  }
}
