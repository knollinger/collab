import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../mod-userdata/mod-userdata.module';
import { UserService } from '../../../mod-user/mod-user.module';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

@Component({
  selector: 'app-pinboard-new',
  templateUrl: './pinboard-new.component.html',
  styleUrls: ['./pinboard-new.component.css']
})
export class PinboardNewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  pinboardForm: FormGroup;
  users: User[] = new Array<User>();

  /**
   * 
   * @param formBuilder 
   * @param userSvc 
   */
  constructor(formBuilder: FormBuilder,
    private userSvc: UserService,
    private avatarSvc: AvatarService) {

    this.pinboardForm = formBuilder.nonNullable.group(
      {
        name: new FormControl<string>('', [Validators.required])
      }
    );
  }

  ngOnInit(): void {

    this.userSvc.listUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;
      })
  }

  onSubmit() {

  }

  getAvatarUrl(user: User): string {
    return this.avatarSvc.getAvatarUrl(user.userId);
  }
}
