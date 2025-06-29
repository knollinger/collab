import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { INode } from "../../../mod-files-data/mod-files-data.module";

import { CalendarEvent } from '../../models/calendar-event';
import { FullCalendarEvent } from '../../models/full-calendar-event';

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
  hashTags: Array<string> = new Array<string>();
  attachments: Array<INode> = new Array<INode>();

  mainFormValid: boolean = false;
  recurringFormValid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CalendarEventEditorComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: IEventEditorData) {

      this.event = data.event.event;
      this.hashTags = data.event.hashTags;
      this.attachments = data.event.attachments;
  }

  onMainFormValidChange(val: boolean) {
    this.mainFormValid = val;
  }
  
  onRecurringFormValidChange(val: boolean) {
    this.recurringFormValid = val;
  }

  get isValid(): boolean {
    return this.mainFormValid && this.recurringFormValid;
  }

  /**
   * 
   * @param tags 
   */
  onHashTagChanged(tags: string[]) {
  }

  /**
   * 
   */
  onSave() {
    this.dialogRef.close(this.data.event);
  }
}
