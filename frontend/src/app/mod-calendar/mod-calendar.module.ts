import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DayPilotModule } from '@daypilot/daypilot-lite-angular';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';

import { ModCalendarRoutingModule } from './mod-calendar-routing.module';
import { CalendarEventEditorComponent } from './components/calendar-event-editor/calendar-event-editor.component';



@NgModule({
  declarations: [
    CalendarMainComponent,
    CalendarEventEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
