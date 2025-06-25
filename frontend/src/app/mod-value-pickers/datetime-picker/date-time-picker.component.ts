import { Component } from '@angular/core';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  standalone: false
})
export class DateTimePickerComponent {

  private _input: HTMLInputElement | null = null;
  private _anchor: HTMLElement | null = null;

  private _date: Date = new Date();
  private _time: Date = new Date();

  isOpen: boolean = false;

  /**
   * 
   */
  public set target(input: HTMLInputElement) {
    this._input = input;
  }

  /**
   * 
   */
  public get target(): HTMLInputElement {
    return this._input!;
  }

  public set anchor(anchor: HTMLElement) {
    this._anchor = anchor;
  }

  /**
   * 
   */
  public get anchor(): HTMLElement {
    return this._anchor || this.target;
  }

  /**
   * 
   */
  toggle() {
    this.isOpen = !this.isOpen;
  }

  public get width(): string {
    const result = this._anchor?.clientWidth + 'px';
    return result;
  }

  get date(): Date {
    return new Date(this._date);
  }

  /**
   * Wird vom mat-calendar gerufen wenn ein Tag ausgewählt wurde
   */
  set date(date: Date) {

    this._date = new Date(date);
  }

  /**
   * 
   */
  get time(): Date {
    return this._time;
  }

  set time(time: Date) {

    this._time = new Date(time);
  }

  onSubmit() {

    const result = new Date(this._date.getFullYear(),
      this._date.getMonth(),
      this._date.getDate(),
      this._time.getHours(),
      this._time.getMinutes(),
      this._time.getSeconds());

    const val = result.toISOString().replace('Z', '');

    // const val=`${this._date.getFullYear()}-${this._date.getMonth()}-${this._date.getDate()}T${this._time.getHours()}:${this._time.getMinutes()}`;
    console.log(val);
    if (this._input) {
      this._input.value = val;
    }
    this.isOpen = false;
  }

  onAbort() {
    this.isOpen = false;
  }
}
