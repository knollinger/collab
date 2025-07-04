import { Component, DestroyRef, inject, OnInit, Type } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { BackendRoutingService } from '../../../mod-commons/mod-commons.module';

import { IWidgetDescriptor } from '../dashboard-widget/iwidget-descriptor';
 
import { FilesWidgetComponent } from '../widgets/files-widget/files-widget.component';
import { CalendarWidgetComponent } from '../widgets/calendar-widget/calendar-widget.component';
import { ClockWidgetComponent } from '../widgets/clock-widget/clock-widget.component';

@Component({
  selector: 'app-dashboard-workspace',
  templateUrl: './dashboard-workspace.component.html',
  styleUrls: ['./dashboard-workspace.component.css'],
  standalone: false
})
export class DashboardWorkspaceComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  gridCols: number = 8;
  rowHeight: string = '20%';

  constructor(
    private backendRouter: BackendRoutingService,
    private dashboardSvc: DashboardService) {
  }

  widgets: IWidgetDescriptor[] = [
    { id: 2, width: 1, height: 1, widgetType: ClockWidgetComponent },
    { id: 3, width: 7, height: 4, widgetType: FilesWidgetComponent },
    { id: 1, width: 1, height: 3, widgetType: CalendarWidgetComponent },
  ];

  ngOnInit() {

  }
}
