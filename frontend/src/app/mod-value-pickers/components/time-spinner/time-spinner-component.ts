import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-time-spinner',
  templateUrl: './time-spinner-component.html',
  styleUrls: ['./time-spinner-component.css'],
  standalone: false
})
export class TimeSpinnerComponent {

  private _time: Date = new Date();

  @Input()
  set time(time: Date | null) {

    if(!time) {
      time = new Date();
    }
    time.setFullYear(0);
    time.setMonth(0);
    time.setDate(0);
  }
  
  get time(): Date {
    return this._time;
  }
  
  @Input()
  showSeconds: boolean = false;

  @Output()
  timeChange: EventEmitter<Date> = new EventEmitter<Date>();

  get hours(): number {
    return this._time.getHours();
  }

  set hours(hours: number) {
    this._time.setHours(hours);
    this.timeChange.emit(this._time);
  }

  get minutes(): number {
    return this._time.getMinutes();
  }

  set minutes(minutes: number) {
    this._time.setMinutes(minutes);
    this.timeChange.emit(this._time);
  }

  get seconds(): number {
    return this._time.getSeconds();
  }

  set seconds(seconds: number) {
    this._time.setSeconds(seconds);
    this.timeChange.emit(this._time);
  }
}
