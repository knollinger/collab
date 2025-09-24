import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService, UserService } from '../../../mod-user/mod-user.module';
import { AvatarService, Group, User } from '../../../mod-userdata/mod-userdata.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css'],
  standalone: false
})
export class PermissionListComponent implements OnInit {

  form: FormGroup;
  users: User[] = new Array<User>();
  groups: Group[] = new Array<Group>();

  private destroyRef = inject(DestroyRef);

  @Input()
  ownerUUID: string = '';
  
  @Input()
  ownerGroupUUID: string = '';
  
  /**
   * 
   * @param formBuilder 
   */
  constructor(private formBuilder: FormBuilder,
    private userSvc: UserService,
    private groupSvc: GroupService,
    private avatarSvc: AvatarService) {

    this.form = new FormGroup({
      lines: this.formBuilder.array([])
    });
  }

  /**
   * Lade alle Benutzer und alle Gruppen
   */
  ngOnInit(): void {

    this.userSvc.getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;
      })

    this.groupSvc.listGroups(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.groups = groups;
      })
  }

  /**
   * Liefere alle Permission-Entries als FormArray
   */
  get lines(): FormArray {
    return this.form.controls['lines'] as FormArray;
  }

  /**
   * 
   */
  public addLine() {

    const permsForm = this.formBuilder.group(
      {
        uuid: new FormControl('', [Validators.required]),
        permRead: new FormControl(false),
        permWrite: new FormControl(false),
        permDelete: new FormControl(false)
      }
    );
    permsForm.markAllAsTouched();
    this.lines.push(permsForm);
    console.log(this.lines.value);
  }

  /**
   * 
   * @param idx 
   */
  public deleteLine(idx: number) {
    this.lines.removeAt(idx);
    console.log(this.lines.value);
  }

  /**
   * Liefere einen PermissionsEntry als FormGroup
   * 
   * @param idx 
   * @returns 
   */
  public getPermsRow(idx: number): FormGroup {

    return this.lines.at(idx) as FormGroup;
  }

  getAvatar(user: User): string {
    return this.avatarSvc.getAvatarUrl(user.userId);
  }
}
