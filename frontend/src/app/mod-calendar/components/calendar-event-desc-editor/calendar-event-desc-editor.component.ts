import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import Quill from 'quill';

import { CalendarEvent } from '../../models/calendar-event';

/**
 * 
 */
@Component({
  selector: 'app-calendar-event-desc-editor',
  templateUrl: './calendar-event-desc-editor.component.html',
  styleUrls: ['./calendar-event-desc-editor.component.css'],
  standalone: false
})
export class CalendarDescEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private quill: Quill | null = null;

  /**
   * 
   */
  constructor() {

  }

  /**
   * 
   */
  ngOnInit() {

    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: {

        }
      }
    });
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the description text                                          */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  private _event: CalendarEvent = CalendarEvent.empty();

  /**
   * 
   */
  get event(): CalendarEvent {
    return this._event;
  }

  /**
   * 
   */
  @Input()
  set event(val: CalendarEvent) {
    this._event = val;
    this.loadDocument();
  }

  /**
   * 
   */
  @Output()
  eventChange: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* document handling                                                       */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  private loadDocument() {
  }
}
