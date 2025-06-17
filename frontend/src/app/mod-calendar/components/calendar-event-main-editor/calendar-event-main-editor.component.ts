import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { CalendarEvent } from '../../models/calendar-event';

@Component({
  selector: 'app-calendar-event-main-editor',
  templateUrl: './calendar-event-main-editor.component.html',
  styleUrls: ['./calendar-event-main-editor.component.css'],
  standalone: false
})
export class CalendarEventMainEditorComponent implements OnInit {

  @Input()
  event: CalendarEvent = CalendarEvent.empty();

  repeatFrequences = [
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
  ];


  daysOfMonth: number[];
  daysOfWeek = [
    { title: 'Montag', value: 1 },
    { title: 'Dienstag', value: 2 },
    { title: 'Mittwoch', value: 3 },
    { title: 'Donnerstag', value: 4 },
    { title: 'Freitag', value: 5 },
    { title: 'Samstag', value: 6 },
    { title: 'Sonntag', value: 0 },
  ];

  eventForm: FormGroup;

  /**
   * 
   * @param formBuilder 
   */
  constructor(
    formBuilder: FormBuilder) {

    this.eventForm = formBuilder.group({
      title: new FormControl('', [Validators.required]),
      start: new FormControl(moment().format('YYYY-MM-DDTHH:mm'), [Validators.required]),
      end: new FormControl(moment().format('YYYY-MM-DDTHH:mm'), [Validators.required]),
      fullDay: new FormControl(false, [Validators.required]),
      repeat_freq: new FormControl('ONCE', [Validators.required])
    });

    this.daysOfMonth = new Array<number>(31);
    for (let i = 1; i < 32; ++i) {
      this.daysOfMonth[i - 1] = i;
    }
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.eventForm.get('title')?.setValue(this.event.title);
    this.eventForm.get('start')?.setValue(moment(this.event.start).format('YYYY-MM-DDTHH:mm'));
    this.eventForm.get('end')?.setValue(moment(this.event.end).format('YYYY-MM-DDTHH:mm'));
    this.eventForm.get('fullDay')?.setValue(this.event.fullDay);
  }

  /**
   * 
   */
  get isFullDay(): boolean {
    return this.eventForm.get('fullDay')?.value;
  }
}
