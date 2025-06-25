import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calendar-recurring-editor',
  templateUrl: './calendar-recurring-editor.component.html',
  styleUrls: ['./calendar-recurring-editor.component.css'],
  standalone: false
})
export class CalendarRecurringEditorComponent {

  recurringForm: FormGroup;

  repeatFrequences = [
    {
      title: 'Tag(e)',
      value: 'DAILY'
    },
    {
      title: 'Woche(n)',
      value: 'WEEKLY'
    },
    {
      title: 'Monat(e)',
      value: 'MONTHLY'
    },
    {
      title: 'Jahr(e)',
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

  constructor(
    formBuilder: FormBuilder) {

    this.recurringForm = formBuilder.group({
      repeatAll: new FormControl(1),
      repeat_freq: new FormControl('DAILY'),
      repMode: new FormControl('REPEAT_INFINITE')
    });

    this.daysOfMonth = new Array<number>(31);
    for (let i = 1; i < 32; ++i) {
      this.daysOfMonth[i - 1] = i;
    }
  }

}
