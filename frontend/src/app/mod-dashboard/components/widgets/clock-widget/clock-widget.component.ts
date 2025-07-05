import { Component, OnDestroy, OnInit } from '@angular/core';
import { IWidget } from '../../dashboard-widget/iwidget';

@Component({
  selector: 'app-clock-widget',
  templateUrl: './clock-widget.component.html',
  styleUrls: ['./clock-widget.component.css'],
  standalone: false
})
export class ClockWidgetComponent implements OnInit, OnDestroy, IWidget {

  private _timer: number = -1;
  date: Date = new Date();

  ngOnInit(): void {

    this._timer = window.setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {

    window.clearInterval(this._timer);
  }
}
