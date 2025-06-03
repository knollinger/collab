import { Component, Input } from '@angular/core';
import { DateTimePickerComponent } from './date-time-picker.component';

@Component({
  selector: 'app-date-time-picker-toggle',
  templateUrl: './date-time-picker-toggle.component.html',
  styleUrls: ['./date-time-picker-toggle.component.css'],
  standalone: false
})
export class DateTimePickerToggleComponent {

  @Input()
  for: DateTimePickerComponent | null = null;

  onClick(evt: MouseEvent) {

    if (this.for) {
      this.for.toggle();
    }
  }
}
