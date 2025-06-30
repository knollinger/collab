import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FullCalendarEvent } from '../../models/full-calendar-event';

@Component({
  selector: 'app-calendar-query-delete-menu',
  templateUrl: './calendar-query-delete-menu.component.html',
  styleUrls: ['./calendar-query-delete-menu.component.css'],
  standalone: false
})
export class CalendarQueryDeleteMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  triggerPosX: string = '';
  triggerPosY: string = '';
  eventId: string = '';

  /**
   * 
   * @param evt 
   */
  public show(evt: MouseEvent, evtId: string) {

    if (this.trigger) {
      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;
      this.eventId = evtId; 
      this.trigger.openMenu();
    }
  }

  onDeleteElement() {

  }

  onDeleteSerie() {
    
  }
}
