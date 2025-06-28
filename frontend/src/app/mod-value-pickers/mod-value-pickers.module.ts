import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

import { OverlayModule } from '@angular/cdk/overlay';

import { DateTimePickerDirective } from './datetime-picker/datetime-picker.directive';
import { DateTimePickerComponent } from './datetime-picker/date-time-picker.component';
import { DateTimePickerToggleComponent } from './datetime-picker/date-time-picker-toggle.component';

import { TimeSpinnerComponent } from './components/time-spinner/time-spinner-component';
import { NumberSpinnerComponent } from './components/number-spinner/number-spinner.component';

@NgModule({
  declarations: [
    DateTimePickerDirective,
    DateTimePickerComponent,
    DateTimePickerToggleComponent,
    TimeSpinnerComponent,
    NumberSpinnerComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    OverlayModule
  ],
  exports: [
    DateTimePickerDirective,
    DateTimePickerComponent,
    DateTimePickerToggleComponent,
    TimeSpinnerComponent,
    NumberSpinnerComponent
  ]
})
export class ModValuePickersModule { }
