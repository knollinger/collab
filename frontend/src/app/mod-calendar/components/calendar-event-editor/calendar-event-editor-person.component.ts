import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CalendarEvent } from '../../models/calendar-event';
import { User } from '../../../mod-userdata/mod-userdata.module';

/**
 * 
 */
@Component({
  selector: 'app-calendar-event-editor-person',
  templateUrl: './calendar-event-editor-person.component.html',
  styleUrls: ['./calendar-event-editor-person.component.css'],
  standalone: false
})
export class CalendarEventEditorPersonComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  personForm: FormGroup;

  _requiredUsers: User[] = new Array<User>();
  _optionalUsers: User[] = new Array<User>();

  @Output()
  requiredUsersChange: EventEmitter<User[]> = new EventEmitter<User[]>();

  @Output()
  optionalUsersChange: EventEmitter<User[]> = new EventEmitter<User[]>();

  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  /** 
   * 
   */
  constructor(formBuilder: FormBuilder) {
    this.personForm = formBuilder.group({
      required: new FormControl(this.requiredUsers, [Validators.required]),
      optional: new FormControl(this.optionalUsers)
    });
  }

  /**
   * 
   */
  ngOnInit() {

    this.personForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        this.onFormChange();
      })
  }

  @Input()
  set requiredUsers(users: User[]) {
    this._requiredUsers = users;
    this.fillForm();
  }

  @Input()
  set optionalUsers(users: User[]) {
    this._optionalUsers = users;
    this.fillForm();
  }

  private fillForm() {

    const val = {
      required: this._requiredUsers,
      optional: this._optionalUsers
    };
    this.personForm.setValue(val);
    this.valid.next(this.personForm.valid);
  }

  private onFormChange() {

    const val = this.personForm.value;
    this.valid.next(this.personForm.valid);
  }
}
