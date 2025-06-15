import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-button',
  templateUrl: './dashboard-button.component.html',
  styleUrls: ['./dashboard-button.component.css'],
  standalone: false
})
export class DashboardButtonComponent {

  @Input()
  title: string = '';

  @Input()
  icon: string = '';

}
