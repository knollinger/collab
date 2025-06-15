import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from '../../../mod-userdata/mod-userdata.module';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.css'],
  standalone: false
})
export class AvatarSelectorComponent implements OnInit, OnDestroy {

  @Output()
  change: EventEmitter<File> = new EventEmitter<File>();

  
  @Input()
  set user(user: User) {
    this._user = user;
    this.url = this.avatarSvc.getAvatarUrl(this._user.userId);
  }  
  private _user: User = User.empty();
  
  url: string = '';

  /**
   * 
   * @param userSvc 
   */
  constructor(private avatarSvc: AvatarService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /**
   * 
   */
  ngOnDestroy(): void {

    URL.revokeObjectURL(this.url);
  }

  /**
   * 
   * @param evt 
   */
  onFileSelection(evt: Event) {

    evt.stopPropagation();
    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length) {

      if (this.url) {
        URL.revokeObjectURL(this.url);
      }
      this.url = URL.createObjectURL(input.files[0]);
      this.change.emit(input.files[0]);
    }
  }
}
