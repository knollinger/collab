import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NGX_MAT_DATE_FORMATS, NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModFilesDataModule } from '../mod-files-data/mod-files-data.module';
import { ModHashTagsModule } from '../mod-hashtags/mod-hashtags.module';
import { ModValuePickersModule } from '../mod-value-pickers/mod-value-pickers.module';
import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';
import { CalendarEventMainEditorComponent } from './components/calendar-event-main-editor/calendar-event-main-editor.component';
import { CalendarEventPropertiesDialogComponent } from './components/calendar-event-properties-dialog/calendar-event-properties-dialog.component';

import { ModCalendarRoutingModule } from './mod-calendar-routing.module';
import { CalendarDescEditorComponent } from './components/calendar-event-desc-editor/calendar-event-desc-editor.component';

// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "DD.MM.YYYY HH:mm"
  },
  display: {
    dateInput: "DD.MM.YYYY HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@NgModule({
  declarations: [
    CalendarMainComponent,
    CalendarEventMainEditorComponent,
    CalendarEventPropertiesDialogComponent,
    CalendarDescEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DayPilotModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    NgxMatTimepickerModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModHashTagsModule,
    ModFilesDataModule,
    ModValuePickersModule,
    ModCalendarRoutingModule,
  ],
  exports: [
    ModCalendarRoutingModule
  ],
  providers: [
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },


    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class ModCalendarModule { }
