import { AfterViewInit, Component, DestroyRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { RRuleSet } from 'rrule';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarEventMenuComponent } from '../calendar-event-menu/calendar-event-menu.component';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { IDelta, RecurringRulsesetService } from '../../services/recurring-rulseset.service';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEventCore } from '../../models/calendar-event-core';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css']
})
export class CalendarMainComponent implements AfterViewInit, OnDestroy {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locales: allLocales,
    locale: navigator.language,
    headerToolbar: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialDate: new Date(),
    nowIndicator: true,
    stickyHeaderDates: true,
    editable: true, // Events können via DnD verschoben/resized werden
    selectable: true, // Auswahl eines Time-Ranges via Maus
    select: info => this.onDateSelection(info),
    eventDidMount: info => this.onMountEvent(info),
    eventClick: info => this.onEventClick(info),
    eventDrop: info => this.onEventDrop(info),
    eventResize: info => this.onEventResize(info), //
    events: (info, onSuccess, onError) => this.onLoadEvents(info, onSuccess, onError),
  };

  private destroyRef = inject(DestroyRef);

  @ViewChild('calendar')
  calendar!: FullCalendarComponent;

  @ViewChild('eventMenu')
  eventMenu!: CalendarEventMenuComponent;

  title: string = 'Test';
  viewMode: string = 'dayGridMonth';
  events: CalendarEventCore[] = new Array<CalendarEventCore>();

  private loadEventsSubscribtion: Subscription | null = null;

  /**
   * 
   * @param router 
   * @param calSvc 
   */
  constructor(
    private router: Router,
    private titleBarSvc: TitlebarService,
    private newCalSvc: CalendarService,
    private recurringSvc: RecurringRulsesetService) {

  }

  /**
   * 
   */
  ngAfterViewInit(): void {
    this.titleBarSvc.subTitle = 'Kalender';
  }

  /**
   * 
   */
  ngOnDestroy(): void {

    if (this.loadEventsSubscribtion) {
      this.loadEventsSubscribtion.unsubscribe();
    }
  }

  /**
   * Eine Callback-Funktion, welche am FullCalendar als EventSource registriert
   * wird.
   * 
   * Immer dann, wenn der Calendar neue Events braucht ruft er diese Funktion. 
   * Eine (mehr oder weniger) ausführliche Doku findest Du unter 
   * https://fullcalendar.io/docs/events-function
   * 
   * Die Methode wird im Lifecycle des Calendars sehr oft gerufen. Bei jedem
   * goBack, goFore, goToday, setViewMode. Und jedes mal wird der CalendarService
   * mit getAllEvents gerufen, jedesmal ist eine Subscription auf das gelieferte 
   * Observable nötig.
   * 
   * Aus diesem Grund verwenden wir hier kein takeUntilDestroyed, wir können die 
   * vorherige Subscription sofort wieder freigeben. Und wenn die COmponent 
   * gelöscht wird, dann geben wir im ngOnDestroy einfach die letzte Subscription
   * frei. 
   * 
   * Der RAM-Verbrauch wirds uns danken :-)
   *  
   * 
   * @param info 
   * @param onSuccess 
   * @param onError 
   */
  private onLoadEvents(info: any, onSuccess: any, onError: any) {

    if (this.loadEventsSubscribtion) {
      this.loadEventsSubscribtion.unsubscribe();
    }

    this.loadEventsSubscribtion = this.newCalSvc.getAllEvents(info.start, info.end)
      .subscribe(result => {

        
        this.events = result;
        const mapped = result.map(e => {
          return e.toFullcalendarEvent();
        });
        onSuccess(mapped);
      });
  }

  /**
   * Lade alle Events neu
   */
  onReload() {
    this.calendar.getApi().refetchEvents();
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
        this.eventMenu.show(jsEvent, event);
      }
    })
  }

  /**
   * 
   * @param evt 
   */
  onViewModeChange(evt: MatButtonToggleChange) {
    this.viewMode = evt.value;
    this.calendar.getApi().changeView(evt.value);
  }

  /**
   * 
   */
  onGoBack() {
    this.calendar.getApi().prev();
  }

  /**
   * 
   */
  onGoToday() {
    this.calendar.getApi().today();
  }

  /**
   * 
   */
  onGoFore() {
    this.calendar.getApi().next();
  }

  /**
   * 
   */
  get date(): Date {
    return this.calendar ? this.calendar.getApi().getDate() : new Date();
  }

  /**
   * Timerange-Auswahl im Kalender
   * 
   * @param info 
   */
  onDateSelection(info: any) {

    const end = info.end;

    // 
    // Sonderlocke bei Ganztags-Auswahl:
    // Das EventModel vom FullCalendar betrachtet das EndDate immer als excluding,
    // alsdo wird der TimeRange als [start, end[ definiert. Bei TimeGrid-basierten
    // Views ist das wurscht, bei Tages-basierten Views kommt es zu eklatanten
    // Verschiebungen
    //
    if (info.allDay) {
      end.setSeconds(end.getSeconds() - 1);
    }

    const startTS = info.start.getTime();
    const endTS = end.getTime();
    const url = `/calendar/event?start=${startTS}}&end=${endTS}&fullDay=${info.allDay}`;
    this.router.navigateByUrl(url);
  }

  /**
   * Ein Event wurde angeklickt, ab in den EventEditor!
   * 
   * @param info 
   */
  onEventClick(info: any) {

    const url = `/calendar/event?eventId=${info.event.id}`;
    this.router.navigateByUrl(url);
  }

  /**
   * Beim Drop verschieben wir ein Event. Das bedeutet, das die Timestamps
   * für start und end verschoben werden müssen. 
   * 
   * Das Info-Objekt beinhaltet ein Property "delta", dies wird dem 
   * RecurringRulsesetService einfach zum fressen hingehalten, soll der
   * sich drum kümmern.
   *  
   * @param info 
   */
  onEventDrop(info: any) {

    const evt = this.getEventById(info.event.id);
    if (evt) {

      const delta = info.delta as IDelta;
      const currRuleSet = evt.rruleSet as RRuleSet;
      const newStart = this.recurringSvc.applyDateDelta(evt.start, delta);
      const newEnd = this.recurringSvc.applyDateDelta(evt.end, delta);
      const newRuleSet = (evt.isRecurring) ? this.recurringSvc.adjustRRuleSet(currRuleSet, delta) : evt.rruleSet;

      const newEvt = new CalendarEventCore(evt.uuid, evt.owner, evt.title, newStart, newEnd, evt.desc, evt.fullDay, newRuleSet);
      this.updateCoreEvent(newEvt);
    }
  }

  /**
   * Wir lassen resize nur am Ende eines Events zu, aus diesem Grund
   * reicht es aus das endDelta-Property aus dem info-Objekt zu verarbeiten.
   * 
   * Wir berechnen also nur den end-Timestamp des Events neu.
   *  
   * @param info 
   */
  onEventResize(info: any) {

    const evt = this.getEventById(info.event.id);
    if (evt) {
      const delta = info.endDelta as IDelta;
      const newEnd = this.recurringSvc.applyDateDelta(evt.end, delta)
      const newEvt = new CalendarEventCore(evt.uuid, evt.owner, evt.title, evt.start, newEnd, evt.desc, evt.fullDay, evt.rruleSet);
      this.updateCoreEvent(newEvt);
    }
  }

  /**
   * 
   * @param evt 
   */
  private updateCoreEvent(evt: CalendarEventCore) {

    this.newCalSvc.updateEventTime(evt)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        // this.loadEvents();
      })
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  private getEventById(id: string): CalendarEventCore | null {

    console.dir(this.events);
    for (let event of this.events) {
      console.log(`test '${event.uuid}' === '${id}'`);
      if (event.uuid === id) {
        return event;
      }
    }
    return null;
  }
} 
