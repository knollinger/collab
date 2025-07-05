import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../../services/dashboard.service';

import { ChangeDimensionsEvent } from '../dashboard-widget-properties/dashboard-widget-properties.component';

import { DashboardWidgetDescriptor, IDashboardWidgetDescriptor } from '../../models/dashboard-widget-descriptor';
import { WidgetTypeRegistryService } from '../../services/widget-type-registry.service';

@Component({
  selector: 'app-dashboard-workspace',
  templateUrl: './dashboard-workspace.component.html',
  styleUrls: ['./dashboard-workspace.component.css'],
  standalone: false
})
export class DashboardWorkspaceComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  gridCols: number = 4;
  rowHeight: string = '20%';

  private json = '[{"id": "1", "widgetType":"clock","width":1,"height":1},{"id": "2", "widgetType":"files","width":3,"height":4},{"id": "3", "widgetType":"calendar","width":1,"height":3}]';
  widgets: DashboardWidgetDescriptor[] = [];

  /**
   * 
   * @param backendRouter 
   * @param dashboardSvc 
   * @param typeRegistry 
   */
  constructor(
    private dashboardSvc: DashboardService,
    private typeRegistry: WidgetTypeRegistryService) {
  }

  /**
   * 
   */
  ngOnInit() {

    // this.widgets = JSON.parse(this.json).map((item: IDashboardWidgetDescriptor) => {
    //   return DashboardWidgetDescriptor.fromJSON(item, this.typeRegistry);
    // })
    this.dashboardSvc.loadWidgets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(widgets => {
        this.widgets = widgets;
      })
  }

  /**
   * 
   * @param evt 
   */
  onChangeWidgetDimensions(evt: ChangeDimensionsEvent) {

    this.widgets.forEach(w => {
      if (w.id === evt.id) {
        w.height = evt.height;
        w.width = evt.width;
      }
    });
    this.widgets = Array.of(...this.widgets);
  }

  /**
   * Lösche das Widget mit der gegebenen Id
   * 
   * @param id 
   */
  onDeleteWidget(id: string) {

    this.widgets = this.widgets.filter(w => {
      return w.id !== id;
    })
  }
}
