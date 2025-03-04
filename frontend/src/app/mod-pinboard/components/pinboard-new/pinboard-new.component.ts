import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../../mod-user/mod-user.module';

@Component({
  selector: 'app-pinboard-new',
  templateUrl: './pinboard-new.component.html',
  styleUrls: ['./pinboard-new.component.css']
})
export class PinboardNewComponent implements OnInit {

  pinboardForm: FormGroup;
  users: User[] = new Array<User>();

  /**
   * 
   * @param formBuilder 
   * @param userSvc 
   */
  constructor(formBuilder: FormBuilder,
    private userSvc: UserService) {

    this.pinboardForm = formBuilder.group(
      {
        name: new FormControl('', [Validators.required])
      }
    );
  }

  ngOnInit(): void {

    this.userSvc.listUsers().subscribe(users => {
      this.users = users;
    })
  }

  onSubmit() {

  }

  getAvatarUrl(user: User): string {
    return this.userSvc.getAvatarUrl(user.userId);
  }
}
