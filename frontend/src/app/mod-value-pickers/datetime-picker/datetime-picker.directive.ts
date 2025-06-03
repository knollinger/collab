import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { DateTimePickerComponent } from './date-time-picker.component';
import * as moment from 'moment';

/**
 * Die Direktive registriert das InputField an der eigentlichen 
 * Picker-Component.
 * 
 * Für eine Dokumentation der Verwendung siehe das README.asc-File
 * im Root des Moduls.
 * 
 * Des weiteren wird bei focus/blur der ElementTyp zwischen datetime-local 
 * (onFocus) und text (onBlur) umgeschaltet. Dadurch werden die unsäglichen
 * default-Placeholder bei leeren Elementen entfernt, dieser würden sonst
 * mit dem floating-Label eines FormField kollidieren.
 */
@Directive({
  selector: '[appDateTimePicker]',
  standalone: false
})
export class DateTimePickerDirective implements AfterViewInit {

  private inputElem: HTMLInputElement;

  /**
   * erhält die Referenz auf die eigentliche Picker-Component
   */
  @Input()
  appDateTimePicker: DateTimePickerComponent | null = null;

  @HostBinding('type')
  type = 'datetime-local';

  /**
   *
   * @param el die ElementReferenz auf das mit der Direktive versehene Element
   */
  constructor(elRef: ElementRef<HTMLInputElement>) {

    this.inputElem = elRef.nativeElement;
    console.log(this.inputElem.type + ' ' + this.inputElem.value);
    // this.type = this.inputElem.value ? 'datetime-local' : 'text';
  }

  /**
   * 
  */
  ngAfterViewInit(): void {

    if (this.appDateTimePicker) {

      this.appDateTimePicker.target = this.inputElem;

      const anchor = this.findFormField(this.inputElem);
      this.appDateTimePicker.anchor = anchor || this.inputElem;
    }
  }

  @HostListener('focus')
  onFocus() {


    if (this.inputElem.type === 'text') {

      const val = this.inputElem.value;
      if (val) {

        const myDate = moment(val, 'DD.MM.YYYY, HH:mm');
        setTimeout(() => {
          const newVal = myDate.format('YYYY-MM-DDTHH:mm');
          this.inputElem.value = newVal;
        }, 10);
      }
    }
    this.type = 'datetime-local';
  }

  @HostListener('blur')
  onBlur() {


    const val = this.inputElem.value;
    if (this.inputElem.type === 'datetime-local') {

      console.log(val);
      if (val) {

        const myDate = moment(val, 'YYYY-MM-DDTHH:mm');
        setTimeout(() => {
          const newVal = myDate.format('DD.MM.YYYY, HH:mm');
          this.inputElem.value = newVal;
        }, 10);
      }
    }
    this.type = 'text';
  }

  /**
   * Es wird (beginnend beim InputField) aufwärts nach einem
   * Element gesucht, desser Parent ein mat-form-field ist.
   * 
   * Das mat-form-field selbst nützt wenig, da dort noch diverse
   * margins und paddings dazu kommen.
   * 
   * @param elem 
   * @returns 
   */
  private findFormField(elem: HTMLElement): HTMLElement | null {

    let current = elem;
    while (current.parentElement && current.parentElement.tagName.toLowerCase() !== 'mat-form-field') {
      current = current.parentElement;
    }
    return current || elem;
  }
}