import { Component, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';

/**
 * Das DashboardWidget dient als Host für beliebige Components und stellt
 * diese auf dem Dashboard dar.
 * 
 */
@Component({
  selector: 'app-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.css'],
  standalone: false
})
export class DashboardWidget implements OnInit {

  @Input()
  widgetType: Type<Component> | null = null;

  @Input()
  id: number = 0;

  @Input()
  width: number = 1;

  @Input()
  maxWidth: number = 1;

  @Input()
  height: number = 1;

  @ViewChild('viewCnr', { static: true, read: ViewContainerRef })
  viewCnr!: ViewContainerRef;

  /**
   * Der Typ der Component welche im Widget angezeigt werden soll.
   * Um diese Component dynamisch erzeugen zu können, verwendet
   * das Widget intern einen ng-container und holt sich diesen
   * als ViewContainerRef. Dort gibts dann so was schönes wie
   * createComponent :-)
   */
  ngOnInit() {

    if (this.widgetType) {
      this.viewCnr.clear();
      this.viewCnr.createComponent(this.widgetType);
    }
  }

  /**
   * 
   */
  onShowSettings() {
  }
}
