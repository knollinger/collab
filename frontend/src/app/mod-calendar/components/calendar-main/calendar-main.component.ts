import { Component, OnInit } from '@angular/core';

import { DayPilot, DayPilotCalendarComponent } from "@daypilot/daypilot-lite-angular";

import { InputBoxService, TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css']
})
export class CalendarMainComponent implements OnInit {

  today: Date = new Date();
  events: DayPilot.EventData[] = [];

  calendarConfig: DayPilot.CalendarConfig;

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private titleBarSvc: TitlebarService,
    private inputSvc: InputBoxService) {

    this.calendarConfig = this.createCalendarConfig();
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titleBarSvc.subTitle = "Kalender";
  }

  private createCalendarConfig(): DayPilot.CalendarConfig {

    const cfg: DayPilot.CalendarConfig = {

      viewType: "Week",
      heightSpec: "Full",
      locale: 'de-DE',
      weekStarts: 1,  // Woche startet am Montag

      onTimeRangeSelected: (args) => {
        this.onTimeRangeSelect(args.control, args.start, args.end);
      },
      onEventClick: (args) => {
        this.onEventClick(args.control, args.e);
      },
      onEventMove: (args) => {
        this.onEventMove(args.control, args.e.id(), args.newStart, args.newEnd);
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

  onEventClick(cal: DayPilot.Calendar, evt: DayPilot.Event) {

    this.inputSvc.showInputBox('Termin-Titel', 'Termin-Titel', evt.text()).subscribe(text => {

      if (text) {
        evt.text(text);
        cal.events.update(evt);
      }
    });
  }

  onEventMove(cal: DayPilot.Calendar, evtId: DayPilot.EventId, newStart: DayPilot.Date, newEnd: DayPilot.Date) {

    console.log(evtId);
  }
}
