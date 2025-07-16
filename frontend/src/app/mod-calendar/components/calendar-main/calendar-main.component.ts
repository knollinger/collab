import { AfterViewInit, Component, DestroyRef, inject, ViewChild } from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { FullCalendarComponent } from '@fullcalendar/angular';

import allLocales from '@fullcalendar/core/locales-all';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CalendarService } from '../../services/calendar.service';
import { Router } from '@angular/router';
import { CalendarEventMenuComponent } from '../calendar-event-menu/calendar-event-menu.component';
import { CalendarEvent } from '../../models/calendar-event';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css']
})
export class CalendarMainComponent implements AfterViewInit {

  private viewModes: Map<string, string> = new Map<string, string>(
    [
      ['DAY', 'timeGridDay'],
      ['WEEK', 'timeGridWeek'],
      ['YEAR', 'dayGridMonth'],
    ]
  );

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locales: allLocales,
    locale: navigator.language,
    headerToolbar: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialDate: new Date(),
    nowIndicator: true,
    stickyHeaderDates: true,
    select: info => this.onDateSelection(info),
    eventDidMount: info => this.onMountEvent(info),
    eventClick: info => this.onEventClick(info),
    eventDrop: info => this.onEventDrop(info),
    eventResize: info => this.onEventResize(info), //
    editable: true, // Events können via DnD verschoben/resized werden
    selectable: true, // Auswahl eines Timeranges via Maus
    events: []
  };

  private destroyRef = inject(DestroyRef);

  @ViewChild('calendar')
  calendar!: FullCalendarComponent;

  @ViewChild('eventMenu')
  eventMenu!: CalendarEventMenuComponent;

  title: string = 'Test';
  viewMode: string = 'MONTH';
  events: CalendarEvent[] = new Array<CalendarEvent>();

  /**
   * 
   * @param router 
   * @param calSvc 
   */
  constructor(
    private router: Router,
    private titleBarSvc: TitlebarService,
    private calSvc: CalendarService) {

  }

  ngAfterViewInit(): void {
    this.titleBarSvc.subTitle='Kalender';
    this.loadEvents();
  }

  /**
   * 
   */
  public loadEvents() {

    if (this.calendar) {
      const start = this.calendar.getApi().view.activeStart;
      const end = this.calendar.getApi().view.activeEnd;

      this.calSvc.getAllEvents(start, end)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {

          this.events = result;
          this.calendarOptions.events = result.map(e => {
            return e.toFullcalendarEvent();
          });
        });
    }
  }

  /**
   * 
   * @param evt 
   */
  onViewModeChange(evt: MatButtonToggleChange) {
    this.viewMode = evt.value;
    this.calendar.getApi().changeView(this.viewModes.get(evt.value) || 'dayGridMonth');
    this.loadEvents();
  }

  /**
   * 
   */
  onGoBack() {
    this.calendar.getApi().prev();
    this.loadEvents();
  }

  /**
   * 
   */
  onGoToday() {
    this.calendar.getApi().today();
    this.loadEvents();
  }

  /**
   * 
   */
  onGoFore() {
    this.calendar.getApi().next();
    this.loadEvents();
  }

  /**
   * 
   */
  get date(): Date {
    return this.calendar ? this.calendar.getApi().getDate() : new Date();
  }

  onDateSelection(info: any) {

    const start = info.start.getTime();
    const end = info.end.getTime();
    const url = `/calendar/event?start=${start}}&end=${end}`;
    this.router.navigateByUrl(url);
  }

  onEventClick(info: any) {

    console.dir(info);
    const url = `/calendar/event?eventId=${info.event.id}`;
    this.router.navigateByUrl(url);
  }

  onEventDrop(info: any) {
    console.log(info.event.id);
    console.log(info.event.start);
    console.log(info.event.end);
  }

  onEventResize(info: any) {
    console.log(info.event.id);
    console.log(info.event.start);
    console.log(info.event.end);
  }

  /**
   * Callback, welcher beim hinzugügen eines Events in den View
   * gerufen wird. Wir hängen hier einfach einen EventListener
   * zur anzeige des ContextMenus an das Element.
   * @param info 
   */
  onMountEvent(info: any) {
    const eventId = info.event.id
    info.el.addEventListener("contextmenu", (jsEvent: MouseEvent) => {

      jsEvent.preventDefault();
      const event = this.getEventById(eventId);
      if (event) {
        console.dir(event);
        this.eventMenu.show(jsEvent, event);
      }
    })
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  private getEventById(id: string): CalendarEvent | null {

    for (let event of this.events) {
      if (event.uuid === id) {
        return event;
      }
    }
    return null;
  }
} 
