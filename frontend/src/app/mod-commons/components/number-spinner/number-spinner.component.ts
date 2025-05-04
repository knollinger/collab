import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Eine Component, welche Browser-übergreifend einen NumberInput
 * mit Spin-Funktionalität bereit stellt.
 * 
 * Die "normalen" <input type="number"> Elemente schauen ziemlich 
 * grauslich aus. Zudem passen sie sich nicht an die benötigten
 * Breiten (abhängig von min und max) an. Und ein Umschalten zwischen
 * vertikal und horizontal gibt es auch nicht.
 * 
 * Die Component leistet all das. 
 */
@Component({
  selector: 'app-number-spinner',
  templateUrl: './number-spinner.component.html',
  styleUrls: ['./number-spinner.component.css'],
  standalone: false
})
export class NumberSpinnerComponent {

  private _min: number = 0;
  private _max: number = 100;
  private _width: string = '3em';
  private _value: number = 0;

  @Input()
  horizontal: boolean = false;

  @Input()
  label: string = 'Label';

  @Input()
  labelBefore: boolean = false;

  @Input()
  set min(val: number) {
    this._min = val;
    this._width = this.calcFieldWidth();
  }

  get min(): number {
    return this._min;
  }

  @Input()
  set max(val: number) {
    this._max = val;
    this._width = this.calcFieldWidth();
  }

  get max(): number {
    return this._max;
  }

  @Input()
  set value(val: number) {
    console.log(`set val to ${val}`);
    this._value = val;
    this.valueChange.emit(this._value);
  }

  get value(): number {
    return this._value;
  }

  onInput(evt: Event) {

    const input = evt.target as HTMLInputElement;
    this.value = Number.parseInt(input.value);
  }

  @Output()
  valueChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * 
   */
  get decrIcon(): string {
    return this.horizontal ? `chevron_left` : 'keyboard_arrow_up';
  }

  /**
   * 
   */
  get incrIcon(): string {
    return this.horizontal ? `chevron_right` : 'keyboard_arrow_down';
  }

  /**
   * Liefere den CSS-kompatiblen String für die Feld-Breite. 
   * Also sowas wie '3em'
   */
  get fieldWidth(): string {
    return this._width;
  }

  /**
   * Berechne die benötigte Feldbreite.
   * 
   * Es wird die Stellen-Zahl für das Maximum von (abs)min
   * und abs(max) berechnet. Sollten auch negative Werte
   * erlaubt sein, so wird einfach eine Stelle mehr berechnet.
   * 
   * Irgendwo müssen wir eine Grenze ziehen, also sind maximal
   * 1000 Stellen erlaubt :-)
   * 
   */
  private calcFieldWidth(): string {

    const max = Math.max(Math.abs(this.min), Math.abs(this.max));

    let exp = 0;
    for (; Math.pow(10, exp) < max && exp < 1000; ++exp);
    exp++;

    if (this.min < 0 || this.max < 0) {
      exp++;
    }
    return `${exp}em`;
  }
}
