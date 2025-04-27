import { Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CalendarService } from '../../services/calendar.service';

export interface IRepeatMode {
  title: string,
  value: string
}

@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css']
})
export class CalendarEventEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

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
  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private calSvc: CalendarService) {

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

    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['uuid'];
        this.calSvc.getEvent(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(evt => {

            this.eventForm.get('title')?.setValue(evt.title);
            this.eventForm.get('start')?.setValue(evt.start);
            this.eventForm.get('end')?.setValue(evt.end);
            this.eventForm.get('desc')?.setValue(evt.desc);
            this.eventForm.get('fullDay')?.setValue(evt.fullDay);
          });
      });
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

  /**
   * 
   */
  onSubmit() {

    console.dir(this.eventForm.value);
  }

  /**
   * 
   */
  onGoBack() {
    this.location.back();
  }
}
