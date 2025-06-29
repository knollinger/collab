import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CalendarEvent } from '../../models/calendar-event';

@Component({
  selector: 'app-calendar-event-editor-main',
  templateUrl: './calendar-event-editor-main.component.html',
  styleUrls: ['./calendar-event-editor-main.component.css'],
  standalone: false
})
export class CalendarEventEditorMainComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  @Input()
  event: CalendarEvent = CalendarEvent.empty();

  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>(false);

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
      fullDay: new FormControl(false),
      private: new FormControl(false)
    });

    this.eventForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        this.onFormChange();
      })
  }

  /**
   * 
   */
  ngOnInit(): void {

    const val = {
      title: this.event.title,
      start: moment(this.event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(this.event.end).format('YYYY-MM-DDTHH:mm'),
      fullDay: this.event.fullDay,
      private: false
    };
    this.eventForm.setValue(val);
    this.onFormChange();
  }

  /**
   * 
   */
  get isFullDay(): boolean {
    return this.eventForm.get('fullDay')?.value;
  }

  onFormChange() {

    const val = this.eventForm.value;
    this.event.title = val.title;
    this.event.start = val.start; // TODO: ist localDate, UTC draus machen
    this.event.end = val.end; // TODO: ist localDate, UTC draus machen
    this.event.fullDay = val.fullDay;
    this.valid.emit(this.eventForm.valid);
  }
}
