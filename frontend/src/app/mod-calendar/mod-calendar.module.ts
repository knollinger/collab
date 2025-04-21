import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayPilotCalendarComponent } from "@daypilot/daypilot-lite-angular";
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';

import { ModCalendarRoutingModule } from './mod-calendar-routing.module';



@NgModule({
  declarations: [
    CalendarMainComponent
  ],
  imports: [
    CommonModule,
    DayPilotModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModCalendarRoutingModule,
  ],
  exports: [
    ModCalendarRoutingModule
  ]
})
export class ModCalendarModule { }
