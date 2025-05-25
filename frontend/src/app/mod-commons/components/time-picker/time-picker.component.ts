import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-time-picker-panel',
  templateUrl: './time-picker-panel.component.html',
  styleUrls: ['./time-picker-panel.component.css'],
  standalone: false
})
export class TimePickerPanelComponent {

  @Input()
  time: Date = new Date(0);

  @Input()
  showSeconds: boolean = false;

  @Output()
  timeChange: EventEmitter<Date> = new EventEmitter<Date>();

  get hours(): number {
    return this.time.getHours();
  }

  set hours(hours: number) {
    this.time.setHours(hours);
    this.timeChange.emit(this.time);
  }

  get minutes(): number {
    return this.time.getMinutes();
  }

  set minutes(minutes: number) {
    this.time.setMinutes(minutes);
    this.timeChange.emit(this.time);
  }

  get seconds(): number {
    return this.time.getSeconds();
  }

  set seconds(seconds: number) {
    this.time.setSeconds(seconds);
    this.timeChange.emit(this.time);
  }
}
