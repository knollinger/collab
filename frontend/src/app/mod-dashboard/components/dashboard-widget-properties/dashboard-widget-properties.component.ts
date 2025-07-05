import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export class ChangeDimensionsEvent {

  constructor(
    public readonly id: string,
    public readonly width: number,
    public readonly height: number) {

  }
}

@Component({
  selector: 'app-dashboard-widget-properties',
  templateUrl: './dashboard-widget-properties.component.html',
  styleUrls: ['./dashboard-widget-properties.component.css'],
  standalone: false
})
export class DashboardWidgetPropertiesComponent implements OnInit {

  @Input()
  id: string = '';

  @Input()
  width: number = 1;

  @Input()
  height: number = 1;

  @Output()
  changeDimensions: EventEmitter<ChangeDimensionsEvent> = new EventEmitter<ChangeDimensionsEvent>();

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      width: new FormControl(),
      height: new FormControl()
    });
  }

  ngOnInit() {

    this.form.setValue({
      width: '' + this.width,
      height: '' + this.height
    });
  }

  onChangeDimensions() {

    const vals = this.form.value;
    const evt = new ChangeDimensionsEvent(
      this.id,
      Number.parseInt(vals.width),
      Number.parseInt(vals.height));
    this.changeDimensions.next(evt);
  }

  onCancel() {
    this.close.next();
  }
}
