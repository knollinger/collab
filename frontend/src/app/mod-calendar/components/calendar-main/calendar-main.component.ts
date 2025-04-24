import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DayPilot } from "@daypilot/daypilot-lite-angular";

import { InputBoxService, MessageBoxService, TitlebarService } from '../../../mod-commons/mod-commons.module';
import { UserService } from '../../../mod-user/mod-user.module';
import { AvatarService, User } from '../../../mod-userdata/mod-userdata.module';

import { CalendarService } from '../../services/calendar.service';
import { EventRenderer } from '../event-renderer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css']
})
export class CalendarMainComponent implements OnInit {

  private static activeAreaYMargin = 4;
  private static deleteHeight = 24;

  private static minCellHeight =
    CalendarMainComponent.activeAreaYMargin +
    EventRenderer.getDeleteAreaHeight() +
    CalendarMainComponent.activeAreaYMargin;

  private destroyRef = inject(DestroyRef);

  users: User[] = new Array<User>();
  today: DayPilot.Date = DayPilot.Date.today();
  events: DayPilot.EventData[] = [];

  calendarConfig: DayPilot.CalendarConfig;
  usersByUUID: Map<string, User> = new Map<string, User>();
  eventToUsers: Map<string, User> = new Map<string, User>();

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private router: Router,
    private calSvc: CalendarService,
    private userSvc: UserService,
    private avatarSvc: AvatarService,
    private titleBarSvc: TitlebarService,
    private inputSvc: InputBoxService,
    private msgBoxSvc: MessageBoxService) {

    this.calendarConfig = this.createCalendarConfig();
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.userSvc.listUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;

        const usersByUUID: Map<string, User> = new Map<string, User>();
        users.forEach(user => {
          usersByUUID.set(user.userId, user);
        });
        this.usersByUUID = usersByUUID;
      });
    this.titleBarSvc.subTitle = "Kalender";
    this.loadEvents();
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  getAvatar(user: User): string {
    return this.avatarSvc.getAvatarUrl(user.userId);
  }

  /**
   * 
   */
  onGoBack() {

    const date = this.today.getDatePart();
    switch (this.calendarConfig.viewType) {
      case 'Day':
        this.today = date.addDays(-1);
        break;

      case 'Week':
        this.today = date.addDays(-7);
        break;

      // case 'Month':
      //   break;
    }
    this.loadEvents();
  }

  /**
   * 
   */
  onGoToday() {

    this.today = DayPilot.Date.today();
    this.loadEvents();
  }

  /**
   * 
   */
  onGoFore() {

    const date = this.today.getDatePart();
    switch (this.calendarConfig.viewType) {
      case 'Day':
        this.today = date.addDays(1);
        break;

      case 'Week':
        this.today = date.addDays(7);
        break;

      // case 'Month':
      //   break;
    }
    this.loadEvents();
  }

  /** 
   * Lade die Events im angegebenen Interval.
   * 
   * Gleichzeitig wird die Map Event -> User neu aufgebaut, diese wird im 
   * onBeforeEventRender-Handler benötigt.
   */
  private loadEvents() {

    this.calSvc.getAllEvents(this.startDate.toDate(), this.endDate.toDate())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(events => {

        const newEvts = events.map(evt => {
          return evt.toDayPilotEvent();
        });
        this.events = newEvts;

        const eventsToUser: Map<string, User> = new Map<string, User>();
        events.forEach(evt => {
          eventsToUser.set(evt.uuid, this.usersByUUID.get(evt.owner) || User.empty());
        });
        this.eventToUsers = eventsToUser;
      })

    // cal.update({
    //   startDate: DayPilot.Date.today().firstDayOfMonth(),
    //   days: DayPilot.Date.today().daysInMonth()
    // });
  }

  /**
   * Erzeuge die Calendar-Konfiguration und registriere die Callbacks
   * 
   * @returns 
   */
  private createCalendarConfig(): DayPilot.CalendarConfig {

    const lang = navigator.language;
    const locale = new Intl.Locale(lang);

    const cfg: DayPilot.CalendarConfig = {

      viewType: "Week",
      heightSpec: "Full",
      locale: lang,
      weekStarts: 1,
      cellHeight: CalendarMainComponent.minCellHeight,

      onEventClick: (args) => {
        this.onEventClick(args.control, args.e);
      },
      onTimeRangeSelected: (args) => {
        this.onTimeRangeSelect(args.control, args.start, args.end);
      },
      onEventMove: (args) => {
        this.onEventMove(args.control, args.e.id(), args.newStart, args.newEnd);
      },
      onBeforeEventRender: (args) => {
        this.onBeforeEventRender(args.control, args.data);
      }
    }
    return cfg;
  }

  /**
   * 
   * @param cal 
   * @param start 
   * @param end 
   */
  onTimeRangeSelect(cal: DayPilot.Calendar, start: DayPilot.Date, end: DayPilot.Date) {

    cal.clearSelection();
    this.inputSvc.showInputBox('Termin-Titel', 'Termin-Titel').subscribe(text => {

      if (text) {

        const evt = new DayPilot.Event({
          start: start,
          end: end,
          id: DayPilot.guid(),
          text: text
        });

        cal.events.add(evt);
      }
    });
  }

  /**
   * 
   * @param cal 
   * @param evt 
   */
  onEventClick(cal: DayPilot.Calendar, evt: DayPilot.Event) {

    const url = `/calendar/edit/${evt.data.uuid}`;
    this.router.navigateByUrl(url);
    // this.inputSvc.showInputBox('Termin-Titel', 'Termin-Titel', evt.text()).subscribe(text => {

    //   if (text) {
    //     evt.text(text);
    //     cal.events.update(evt);
    //   }
    // });
  }

  /**
   * 
   * @param cal 
   * @param evtId 
   * @param newStart 
   * @param newEnd 
   */
  onEventMove(cal: DayPilot.Calendar, evtId: DayPilot.EventId, newStart: DayPilot.Date, newEnd: DayPilot.Date) {

    console.log(evtId);
  }

  /**
   * 
   * @param calSvc 
   * @param arg1 
   */
  onEventDelete(cal: DayPilot.Calendar, evt: DayPilot.Event) {

    console.log('????');
    const msg = `Möchtest Du wirklich den Kalender-Eintrag '${evt.text()}' löschen?`;
    this.msgBoxSvc.showQueryBox('Wirklich?', msg)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {
        if (rsp) {
          alert('delete not yet implemented');
        }
      });
    return false;
  }

  /**
   * 
   * @param control 
   * @param data 
   */
  onBeforeEventRender(cal: DayPilot.Calendar, data: DayPilot.EventData) {

    const user = this.eventToUsers.get(data.id.toString()) || User.empty();
    const userName = `${user.surname} ${user.lastname}`;
    const avatar = this.avatarSvc.getAvatarUrl(user.userId);
    data.areas = [

      // der Delete-Button
      {
        action: "None", // Don't bubble the Click
        onClick: (args) => {
          this.onEventDelete(cal, args.source);
        },
        width: EventRenderer.getDeleteAreaWidth(),
        height: EventRenderer.getDeleteAreaHeight(),
        right: EventRenderer.getDeleteAreaMargin(),
        top: EventRenderer.getDeleteAreaMargin(),
        html: EventRenderer.renderDeleteArea(),
      }
    ]
  }

  /**
   * 
   */
  private get startDate(): DayPilot.Date {

    let date = this.today.getDatePart();
    switch (this.calendarConfig.viewType) {
      case 'Day':
        break;

      case 'Week':
        date = date.firstDayOfWeek();
        break;

      // case 'Month':
      //   break;

    }
    return date;
  }

  /**
   * 
   */
  private get endDate(): DayPilot.Date {

    let date = this.today.getDatePart()
      .addHours(23)
      .addMinutes(59)
      .addSeconds(59)
      .addMilliseconds(9999);

    switch (this.calendarConfig.viewType) {
      case 'Day':
        break;

      case 'Week':
        date = date.addDays(7);
        break;

      // case 'Month':
      //   break;

    }

    return date;
  }
}
