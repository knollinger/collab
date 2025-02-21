import { AfterContentInit, Directive, ElementRef } from '@angular/core';

/**
 * Die Direktive wird verwendet um den initialen Focus auf ein Element einer
 * Component zu setzen. Dazu wird am Element einfach die Direktive angegeben.
 *
 * Beispiel:
 * <input appAutoFocus [value]="someValue">
 */
@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {

  /**
   *
   * @param el die ElementReferenz auf das mit der Direktive versehene Element
   */
  constructor(private element: ElementRef) {

  }

  /**
   * Nach erzeigen den Contents wird der Focus gesetzt. Um das ganze ein
   * wenig zu entzerren wird dies asynch mit einem Delay von 10ms
   * durchgeführt.
   */
  public ngAfterContentInit() {
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 10);
  }
}
