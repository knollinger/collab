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
import { CalendarEventMenuComponent, IDeleteOccurenceEvent } from '../calendar-event-menu/calendar-event-menu.component';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { IDelta, RecurringRulsesetService } from '../../services/recurring-rulseset.service';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEventCore } from '../../models/calendar-event-core';
import { CalendarCategoriesService } from '../../services/calendar-categories.service';
import { SettingsService } from '../../../mod-settings/services/settings.service';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css']
})
export class CalendarMainComponent implements AfterViewInit, OnDestroy {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: '100%',
    locales: allLocales,
    locale: navigator.language,
    headerToolbar: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialDate: new Date(),
    nowIndicator: true,
    businessHours: true,
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

  title: string = '';
  events: CalendarEventCore[] = new Array<CalendarEventCore>();
  categories: Map<string, string> = new Map<string, string>();

  private loadEventsSubscribtion: Subscription | null = null;
  private settings: any = {};

  /**
   * 
   * @param router 
   * @param calSvc 
   */
  constructor(
    private router: Router,
    private titleBarSvc: TitlebarService,
    private calSvc: CalendarService,
    private calCatSvc: CalendarCategoriesService,
    private recurringSvc: RecurringRulsesetService,
    private settingsSvc: SettingsService) {

    this.calCatSvc.getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(catDescs => {

        catDescs.map(catDesc => {
          this.categories.set(catDesc.category, catDesc.color)
        });
      })
  }

  /**
   * 
   */
  private loadSettings() {

    this.settingsSvc.getDomainSettings('calendar')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(settings => {
        this.settings = settings;
        this.calendar.getApi().changeView(this.viewMode);
      })
  }

  /**
   * 
   */
  ngAfterViewInit(): void {
    this.titleBarSvc.subTitle = 'Kalender';
    this.loadSettings();
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

    this.loadEventsSubscribtion = this.calSvc.getAllEvents(info.start, info.end)
      .subscribe(result => {


        this.events = result;
        const mapped = result.map(e => {
          return e.toFullcalendarEvent(this.categories);
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
   * 
   */
  onImport() {
    alert('not yet implemented');
  }

  /**
   * Callback, welcher beim hinzugügen eines Events in den View
   * gerufen wird. Wir hängen hier einfach einen EventListener
   * zur anzeige des ContextMenus an das Element.
   * @param info 
   */
  onMountEvent(info: any) {

    const eventId = info.event.id;
    const currStart = info.event.start;

    info.el.addEventListener("contextmenu", (jsEvent: MouseEvent) => {

      jsEvent.preventDefault();
      const event = this.getEventById(eventId);
      if (event) {
        this.eventMenu.show(jsEvent, event, currStart);
      }
    })
  }

  /**
   * 
   */
  get viewMode(): string {
    return this.settings['viewMode'] || 'dayGridMonth';
  }

  /**
   * 
   */
  set viewMode(val: string) {

    if (val) {
      this.settings['viewMode'] = val;
      this.calendar.getApi().changeView(val);
      this.settingsSvc.setDomainSettings('calendar', this.settings);
    }
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
      const newStart = info.event.start;
      const newEnd = info.event.end;

      const newRuleSet = (evt.isRecurring) ? this.recurringSvc.adjustRRuleSet(currRuleSet, delta) : evt.rruleSet;
      const newEvt = new CalendarEventCore(evt.uuid, evt.owner, evt.title, newStart, newEnd, evt.desc, evt.category, evt.fullDay, newRuleSet);
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
      const newEvt = new CalendarEventCore(evt.uuid, evt.owner, evt.title, evt.start, newEnd, evt.desc, evt.category, evt.fullDay, evt.rruleSet);
      this.updateCoreEvent(newEvt);
    }
  }

  /**
   * Lösche einen Termin aus einer Serie.
   * 
   * Dazu muss lediglich ein neues EXDATE in das RecurrenceSet aufgenommen werden.
   * 
   * @param evt 
   */
  onDeleteOccurence(evt: IDeleteOccurenceEvent) {

    if (evt.event.rruleSet) {
      evt.event.rruleSet.exdate(evt.start);
      this.updateCoreEvent(evt.event);
    }
  }

  /**
   * 
   * @param evt 
   */
  onDeleteEvent(evt: CalendarEventCore) {
    this.calSvc.deleteEvent(evt)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.onReload();
      });
  }

  /** 
   * 
   */
  onExportEvent(evt: CalendarEventCore) {
    alert('exportEvent');

  }

  /**
   * 
   * @param evt 
   */
  private updateCoreEvent(evt: CalendarEventCore) {

    this.calSvc.updateEventCore(evt)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.onReload();
      })
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  private getEventById(id: string): CalendarEventCore | null {

    for (let event of this.events) {
      if (event.uuid === id) {
        return event;
      }
    }
    return null;
  }
} 
