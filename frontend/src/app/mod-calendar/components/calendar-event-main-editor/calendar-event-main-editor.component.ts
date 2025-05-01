import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CalendarEvent } from '../../models/calendar-event';

export interface IRepeatMode {
  title: string,
  value: string
}

@Component({
  selector: 'app-calendar-event-main-editor',
  templateUrl: './calendar-event-main-editor.component.html',
  styleUrls: ['./calendar-event-main-editor.component.css'],
  standalone: false
})
export class CalendarEventMainEditorComponent implements OnInit {

  @Input()
  event: CalendarEvent = CalendarEvent.empty();

  eventForm: FormGroup;
  repeatModes: IRepeatMode[] = [
    {
      title: 'Einmalig',
      value: 'ONCE'
    },
    {
      title: 'Täglich',
      value: 'DAILY'
    },
    {
      title: 'Wöchentlich',
      value: 'WEEKLY'
    },
    {
      title: 'Monatlich',
      value: 'MONTHLY'
    },
    {
      title: 'Jährlich',
      value: 'YEARLY'
    },
    {
      title: 'Benutzer-Definiert',
      value: 'USER_DEFINED'
    },
  ];

  /**
   * 
   * @param formBuilder 
   */
  constructor(
    formBuilder: FormBuilder) {

    this.eventForm = formBuilder.group({
      title: new FormControl('', [Validators.required]),
      start: new FormControl(new Date(), [Validators.required]),
      end: new FormControl(new Date(), [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      fullDay: new FormControl(false, [Validators.required]),
      repeatMode: new FormControl('ONCE', [Validators.required])
    });
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.eventForm.get('title')?.setValue(this.event.title);
    this.eventForm.get('start')?.setValue(this.event.start);
    this.eventForm.get('end')?.setValue(this.event.end);
    this.eventForm.get('desc')?.setValue(this.event.desc);
    this.eventForm.get('fullDay')?.setValue(this.event.fullDay);
  }

  /**
   * 
   */
  get repeatModeName(): string {

    const currMode = this.eventForm.get('repeatMode')!.value;
    for (let mode of this.repeatModes) {
      if (currMode === mode.value) {
        return mode.title;
      }
    }
    return '???';
  }

  /**
   * 
   */
  get isFullDay(): boolean {
    return this.eventForm.get('fullDay')?.value;
  }
}
