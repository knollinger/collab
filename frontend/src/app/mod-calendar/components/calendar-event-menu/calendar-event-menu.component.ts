import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CalendarEventCore } from '../../models/calendar-event-core';

@Component({
  selector: 'app-calendar-event-menu',
  templateUrl: './calendar-event-menu.component.html',
  styleUrls: ['./calendar-event-menu.component.css'],
  standalone: false
})
export class CalendarEventMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  triggerPosX: string = '';
  triggerPosY: string = '';
  calendarEvent: CalendarEventCore = CalendarEventCore.empty();

  /**
   * 
   * @param evt 
   */
  public show(evt: MouseEvent, calendarEvent: CalendarEventCore) {

    if (this.trigger) {
      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;
      this.calendarEvent = calendarEvent; 
      this.trigger.openMenu();
    }
  }

  onDeleteElement() {

  }

  onDeleteSerie() {
    
  }

  onExport() {
    
  }
}
