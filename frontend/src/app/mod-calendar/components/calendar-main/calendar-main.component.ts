import { Component, ViewChild, AfterViewInit, DestroyRef, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";

import { CalendarService } from '../../services/calendar.service';
import { TitlebarService } from "../../../mod-commons/mod-commons.module";

import { CalendarEventPropertiesDialogComponent } from "../calendar-event-properties-dialog/calendar-event-properties-dialog.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
    eventBarVisible: false,
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
    private calSvc: CalendarService) {
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


  loadEvents(): void {
    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    this.calSvc.getAllEvents(from.toDate(), to.toDate()).subscribe(result => {

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

  onBeforeEventRender(args: any) {
    const dp = args.control;
    args.data.areas = [
      {
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        html: '<mat-icon class="material-symbols-outlined" style="background-color: white;">delete</mat-icon>',
        action: "None",
        toolTip: "Löschen",
        onClick: async (args: any) => {
          dp.events.remove(args.source);
        }
      }
    ];
  }

  async onTimeRangeSelected(args: any) {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = args.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    dp.events.add(new DayPilot.Event({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result
    }));
  }

  /**
   * 
   * @param args 
   * @returns 
   */
  onEventClick(args: any) {

    const cal = args.control;

    this.calSvc.getEvent(args.e.id()) //
      .pipe(takeUntilDestroyed(this.destroyRef)) //
      .subscribe(fullEvt => {


        const dialogRef = this.dialog.open(CalendarEventPropertiesDialogComponent, {
          width: '80%',
          maxWidth: '600px',
          data: {
            event: fullEvt
          }
        });

        dialogRef.afterClosed() //
          .pipe(takeUntilDestroyed(this.destroyRef)) //
          .subscribe(result => {

            if (result) {
              alert(JSON.stringify(result));
            }
            else {
              alert('dialog aborted');
            }
          });
      })
  }

  /**
   * 
   * @param args 
   */
  onEventMove(args: any) {

    // doMove(args.control, args.e.id(), args.newStart, args.newEnd);
    alert('not yet implemented');
  }

}