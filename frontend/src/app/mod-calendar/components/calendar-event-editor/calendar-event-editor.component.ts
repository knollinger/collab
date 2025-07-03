import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { INode } from "../../../mod-files-data/mod-files-data.module";

import { CalendarEvent } from '../../models/calendar-event';
import { FullCalendarEvent } from '../../models/full-calendar-event';
import { User } from '../../../mod-userdata/mod-userdata.module';

export interface IEventEditorData {
  event: FullCalendarEvent
}

@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css'],
  standalone: false
})
export class CalendarEventEditorComponent {

  event: CalendarEvent = CalendarEvent.empty();
  requiredUsers: User[] = new Array<User>();
  optionalUsers: User[] = new Array<User>();
  hashTags: Array<string> = new Array<string>();
  attachments: Array<INode> = new Array<INode>();

  mainFormValid: boolean = false;
  recurringFormValid: boolean = false;
  personFormValid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CalendarEventEditorComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: IEventEditorData) {

      this.event = data.event.event;
      this.requiredUsers = data.event.requiredUsers;
      this.optionalUsers = data.event.optionalUsers;
      this.hashTags = data.event.hashTags;
      this.attachments = data.event.attachments;
  }

  onMainFormValidChange(val: boolean) {
    this.mainFormValid = val;
  }
  
  onRecurringFormValidChange(val: boolean) {
    this.recurringFormValid = val;
  }

  onPersonFormValidChange(val: boolean) {
    this.personFormValid = val;
  }

  get isValid(): boolean {
    return this.mainFormValid && this.recurringFormValid && this.personFormValid;
  }

  /**
   * 
   */
  onSave() {
    this.dialogRef.close(this.data.event);
  }
}
