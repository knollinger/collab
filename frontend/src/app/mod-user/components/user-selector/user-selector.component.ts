import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, AvatarService } from '../../../mod-userdata/mod-userdata.module';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {

  @Input()
  users: User[] = new Array<User>();

  @Input()
  selection: User = User.empty();

  @Output()
  selectionChange: EventEmitter<User[]> = new EventEmitter<User[]>();

  private _multiple: boolean = false;

  /**
   * 
   */
  constructor(
    private avatarSvc: AvatarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  @Input()
  set multiple(val: string | boolean) {

    this._multiple = false;
  }

  get multiple(): boolean {
    return this._multiple;
  }


  /**
   * 
   * @param user 
   * @returns 
   */
  getAvatar(user: User): string {
    return this.avatarSvc.getAvatarUrl(user.userId);
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  isSelected(user: User): boolean {
    return user.userId === this.selection.userId;
  }

  /**
   * 
   * @param evt 
   */
  onUserSelectionChange(evt: MatSelectionListChange) {

    const selected = evt.source.selectedOptions.selected;
    if (selected && selected.length) {

      const users = new Array<User>();
      for (let option of selected) {
        users.push(option.value);
      }
      this.selectionChange.emit(users);
    }
  }
}
