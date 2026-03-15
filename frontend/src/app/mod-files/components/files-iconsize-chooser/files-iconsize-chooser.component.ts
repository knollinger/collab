import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-files-iconsize-chooser',
  templateUrl: './files-iconsize-chooser.component.html',
  styleUrls: ['./files-iconsize-chooser.component.css']
})
export class FilesIconsizeChooserComponent {

  private _value: number = 64;

  min: number = 32;
  max: number = 256;
  step: number = 16;

  @Input()
  set value(val: number) {
    this._value = Math.min(val, this.max);
    this.valueChange.next(this._value);
  }

  get value(): number {
    return this._value;
  }

  @Output()
  valueChange: EventEmitter<number> = new EventEmitter<number>();
}
