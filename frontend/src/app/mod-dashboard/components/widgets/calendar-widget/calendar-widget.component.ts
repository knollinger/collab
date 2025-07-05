import { Component } from '@angular/core';
import { IWidget } from '../../dashboard-widget/iwidget';

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.css'],
  standalone: false
})
export class CalendarWidgetComponent implements IWidget  {

}
