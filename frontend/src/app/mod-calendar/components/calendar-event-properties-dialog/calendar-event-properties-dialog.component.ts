import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from '../../models/calendar-event';
import { FullCalendarEvent } from '../../models/full-calendar-event';
import { INode } from '../../../mod-files/mod-files.module';

export interface IEventEditorData {
  event: FullCalendarEvent
}

@Component({
  selector: 'app-calendar-event-properties-dialog',
  templateUrl: './calendar-event-properties-dialog.component.html',
  styleUrls: ['./calendar-event-properties-dialog.component.css'],
  standalone: false
})
export class CalendarEventPropertiesDialogComponent {

  event: CalendarEvent = CalendarEvent.empty();
  hashTags: Array<string> = new Array<string>();
  attachments: Array<INode> = new Array<INode>();

  constructor(
    public dialogRef: MatDialogRef<CalendarEventPropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: IEventEditorData) {

      this.event = data.event.event;
      this.hashTags = data.event.hashTags;
      this.attachments = data.event.attachments;
  }

  onHashTagChanged(tags: string[]) {
  }

  onSave() {
    alert('save event not yet implemented!');
    this.dialogRef.close();
  }
}
