import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DashboardCalendarService } from '../../../services/dashboard-calendar.service';
import { CalendarEventCore } from '../../../../mod-calendar/models/calendar-event-core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.css'],
  standalone: false
})
export class CalendarWidgetComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  events: CalendarEventCore[] = new Array<CalendarEventCore>();
  
  /**
   * 
   * @param calSvc 
   */
  constructor(
    private router: Router,
    private calSvc: DashboardCalendarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.calSvc.loadEvents()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(events => {
      this.events = events;
    })
  }

  /**
   * 
   * @param event 
   */
  onClick(event: CalendarEventCore) {

    const url = `/calendar/event?eventId=${event.uuid}`;
    this.router.navigateByUrl(url);
  }
}
