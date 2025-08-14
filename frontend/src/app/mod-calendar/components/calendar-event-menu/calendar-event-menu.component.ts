import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CalendarEventCore } from '../../models/calendar-event-core';

export interface IDeleteOccurenceEvent {
  event: CalendarEventCore,
  start: Date,
}

@Component({
  selector: 'app-calendar-event-menu',
  templateUrl: './calendar-event-menu.component.html',
  styleUrls: ['./calendar-event-menu.component.css'],
  standalone: false
})
export class CalendarEventMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Output()
  deleteOccurence: EventEmitter<IDeleteOccurenceEvent> = new EventEmitter<IDeleteOccurenceEvent>();

  @Output()
  deleteEvent: EventEmitter<CalendarEventCore> = new EventEmitter<CalendarEventCore>();

  @Output()
  exportEvent: EventEmitter<CalendarEventCore> = new EventEmitter<CalendarEventCore>();

  triggerPosX: string = '';
  triggerPosY: string = '';
  calendarEvent: CalendarEventCore = CalendarEventCore.empty();
  currStart: Date = new Date();

  /**
   * 
   * @param evt 
   */
  public show(evt: MouseEvent, calendarEvent: CalendarEventCore, start: Date) {

    if (this.trigger) {
      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;
      this.calendarEvent = calendarEvent; 
      this.currStart = start; 
      this.trigger.openMenu();
    }
  }

  /**
   * 
   */
  onDeleteElement() {
    const evt = {
      event: this.calendarEvent,
      start: this.currStart
    }
    this.deleteOccurence.emit(evt);
  }

  /**
   * 
   */
  onDeleteSerie() {
    this.deleteEvent.emit(this.calendarEvent);
  }

  /**
   * 
   */
  onExport() {
    this.exportEvent.emit(this.calendarEvent);
  }
}
