import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModFilesDataModule } from '../mod-files-data/mod-files-data.module';
import { ModUserModule } from '../mod-user/mod-user.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModHashTagsModule } from '../mod-hashtags/mod-hashtags.module';
import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';
import { CalendarEventEditorComponent } from './components/calendar-event-editor/calendar-event-editor.component';
import { CalendarEventEditorMainComponent } from './components/calendar-event-editor/calendar-event-editor-main.component';
import { CalendarEventEditorRecurringComponent } from './components/calendar-event-editor/calendar-event-editor-recurring.component';
import { CalendarEventEditorPersonComponent } from './components/calendar-event-editor/calendar-event-editor-person.component';
import { CalendarEventEditorFilesComponent } from './components/calendar-event-editor//calendar-event-editor-files.component';

import { ModCalendarRoutingModule } from './mod-calendar-routing.module';
import { CalendarEventMenuComponent } from './components/calendar-event-menu/calendar-event-menu.component';

@NgModule({
  declarations: [
    CalendarMainComponent,
    CalendarEventEditorComponent,
    CalendarEventEditorMainComponent,
    CalendarEventEditorRecurringComponent,
    CalendarEventEditorPersonComponent,
    CalendarEventEditorFilesComponent,
    CalendarEventMenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DayPilotModule,
    NgxMatMomentModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModUserModule,
    ModSessionModule,
    ModHashTagsModule,
    ModFilesDataModule,
    ModCalendarRoutingModule,
  ],
  exports: [
    ModCalendarRoutingModule
  ],
  providers: [
    // { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },


    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class ModCalendarModule { }
