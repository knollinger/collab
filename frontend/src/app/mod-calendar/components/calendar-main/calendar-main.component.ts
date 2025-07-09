import { Component, ViewChild, AfterViewInit, DestroyRef, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";

import { CalendarService } from '../../services/calendar.service';
import { CommonDialogsService, TitlebarService } from "../../../mod-commons/mod-commons.module";
import { SessionService } from '../../../mod-session/session.module';

import { CalendarEventMenuComponent } from '../calendar-event-menu/calendar-event-menu.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-calendar-main-component',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css'],
  standalone: false
})
export class CalendarMainComponent implements AfterViewInit {

  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;
  @ViewChild('eventMenu') eventMenu!: CalendarEventMenuComponent;

  private destroyRef = inject(DestroyRef);

  events: DayPilot.EventData[] = [];
  date = DayPilot.Date.today();

  configNavigator: DayPilot.NavigatorConfig = {
    locale: navigator.language, // TODO: in FF kommt hier nur ein 'de'. da wirft im Navigator einen "TypeError: r.locale() is undefined"
    showMonths: 2,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };

  configDay: DayPilot.CalendarConfig = {
    durationBarVisible: true,
    locale: navigator.language,
    weekStarts: 1,
    cellHeight: 32,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventMove: this.onEventMove.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: true,
    locale: navigator.language,
    weekStarts: 1,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventMove: this.onEventMove.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configMonth: DayPilot.MonthConfig = {
    eventBarVisible: true,
    locale: navigator.language,
    weekStarts: 1,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventMove: this.onEventMove.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  constructor(
    private dialog: MatDialog,
    private titlebarSvc: TitlebarService,
    private commonDlgsSvc: CommonDialogsService,
    private calSvc: CalendarService,
    private sessionSvc: SessionService,
    private router: Router) {
    this.onViewModeChange('Week');
  }

  /**
   * 
   */
  ngAfterViewInit(): void {
    this.titlebarSvc.subTitle = 'Kalender';
    this.loadEvents();
  }

  /**
   * Wird gerufen, wenn im Navigator eine Selection vorgenommen wurde
   * @param date 
   */
  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  /**
   * 
   */
  onGoBack() {

    switch (this.configNavigator.selectMode) {
      case 'Day':
        this.date = this.date.addDays(-1);
        break;

      case 'Week':
        this.date = this.date.addDays(-7);
        break;

      case 'Month':
        this.date = this.date.addMonths(1);
        break;
    }
  }

  /**
   * 
   */
  onGoToday() {
    this.date = DayPilot.Date.today();
  }

  /**
   * 
   */
  onGoFore() {

    switch (this.configNavigator.selectMode) {
      case 'Day':
        this.date = this.date.addDays(1);
        break;

      case 'Week':
        this.date = this.date.addDays(7);
        break;

      case 'Month':
        this.date = this.date.addMonths(1);
        break;
    }
  }

  /**
   * 
   */
  loadEvents(): void {

    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    this.calSvc.getAllEvents(from.toDate(), to.toDate())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {

        this.events = result.map(e => {
          return e.toDayPilotEvent();
        });
      });
  }

  /**
   * Auswahl des ViewModes
   * @param mode 
   */
  onViewModeChange(mode: 'Day' | 'Week' | 'Month') {

    this.configNavigator.selectMode = mode;
    switch (mode) {
      case 'Day':
        this.configDay.visible = true;
        this.configWeek.visible = false;
        this.configMonth.visible = false;
        break;

      case 'Week':
        this.configDay.visible = false;
        this.configWeek.visible = true;
        this.configMonth.visible = false;
        break;

      case 'Month':
        this.configDay.visible = false;
        this.configWeek.visible = false;
        this.configMonth.visible = true;
        break;

    }
  }

  /**
   * Wird gerufen bevor ein Event gerendert wird. Hier können wir die
   * "activeAreas" einfügen.
   * @param args 
   */
  onBeforeEventRender(args: any) {
    const dp = args.control;
    args.data.areas = [
      {
        top: 4,
        right: 4,
        width: 32, // 24px breite + 2* padding 4px
        height: 32, // 24px höhe + 2* padding 4px
        html: '<mat-icon class="material-symbols-outlined" style="background-color: white;">more_horiz</mat-icon>',
        action: "None",
        toolTip: "Optionen",
        onClick: this.onShowMenuEvent.bind(this)
      }
    ];
  }

  /**
   * 
   * @param args 
   */
  onTimeRangeSelected(args: any) {

    args.control.clearSelection();

    const start = args.start.toDateLocal().getTime();
    const end = args.end.toDateLocal().getTime();
    const url = `/calendar/event?start=${start}}&end=${end}`;
    this.router.navigateByUrl(url);
  }

  /**
   * 
   * @param args 
   * @returns 
   */
  onEventClick(args: any) {

    const cal = args.control;

    const url = `/calendar/event?eventId=${args.e.id()}`;
    this.router.navigateByUrl(url);
  }

  /**
   * 
   * @param args 
   */
  onEventMove(args: any) {

    // doMove(args.control, args.e.id(), args.newStart, args.newEnd);
    alert('not yet implemented');
  }

  /**
   * 
   * @param evtId 
   */
  onShowMenuEvent(event: any) {

    const evtId = event.source.id();
    this.calSvc.getEvent(evtId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(calEvt => {

        this.eventMenu.show(event.originalEvent, calEvt.event);
      });
  }
}