import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface IRepeatMode {
  title: string,
  value: string
}

@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css']
})
export class CalendarEventEditorComponent {

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
  ]

  /**
   * 
   * @param formBuilder 
   */
  constructor(formBuilder: FormBuilder) {

    this.eventForm = formBuilder.group({
      title: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      fullDay: new FormControl(false, [Validators.required]),
      repeatMode: new FormControl('ONCE', [Validators.required])
    });
  }

  get repeatModeName(): string {

    const currMode = this.eventForm.get('repeatMode')!.value;
    for (let mode of this.repeatModes) {
      if (currMode === mode.value) {
        return mode.title;
      }
    }
    return '???';
  }
}
