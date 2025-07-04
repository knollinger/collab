import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-widget-template',
  templateUrl: './dashboard-widget-template.component.html',
  styleUrls: ['./dashboard-widget-template.component.css'],
  standalone: false
})
export class DashboardWidgetTemplateComponent {

  @Input()
  title: string = '';
}
