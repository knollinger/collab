import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../../services/dashboard.service';

import { ChangeDimensionsEvent } from '../dashboard-widget-properties/dashboard-widget-properties.component';

import { DashboardWidgetDescriptor } from '../../models/dashboard-widget-descriptor';
import { WidgetTypeRegistryService, IWidgetTypeAndDesc } from '../../services/widget-type-registry.service';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
  standalone: false
})
export class DashboardMainComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  gridCols: number = 4;
  rowHeight: string = '20%';
  widgets: DashboardWidgetDescriptor[] = [];

  /**
   * 
   * @param backendRouter 
   * @param dashboardSvc 
   * @param typeRegistry 
   */
  constructor(
    private titlebarSvc: TitlebarService,
    private dashboardSvc: DashboardService,
    private widgetRegistrySvc: WidgetTypeRegistryService) {
  }

  /**
   * 
   */
  ngOnInit() {

    this.titlebarSvc.subTitle = 'Dashboard';
    this.dashboardSvc.loadWidgets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(widgets => {
        this.widgets = widgets;
      })
  }

  /**
   * 
   */
  get widgetsToAdd(): IWidgetTypeAndDesc[] {

    return this.widgetRegistrySvc.getWidgetDescs().filter(desc => {
      return this.widgetCanBeAdded(desc)
    });
  }

  /**
   * 
   * @param desc 
   * @returns 
   */
  private widgetCanBeAdded(desc: IWidgetTypeAndDesc): boolean {

    let found = false;

    for (let widget of this.widgets) {
      if (widget.typeName === desc.typeName) {
        found = true;
        break;
      }
    }
    return !found;
  }

  /**
   * 
   * @param widget 
   * @returns 
   */
  calcGridAreaFor(widget: DashboardWidgetDescriptor): string {

    return `span ${widget.height} / span ${widget.width}`;
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

    this.dashboardSvc.deleteWidget(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.widgets = this.widgets.filter(w => {
          return w.id !== id;
        })
      })
  }

  /**
   * 
   * @param typeName 
   */
  onAddWidget(typeName: string) {

    this.dashboardSvc.addWidget(typeName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(widget => {
        this.widgets.push(widget);
      })
  }
}
