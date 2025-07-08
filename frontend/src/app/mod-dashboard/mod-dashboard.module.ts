import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModFilesDataModule } from '../mod-files-data/mod-files-data.module';

import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { ModDashboardRoutingModule } from './mod-dashboard-routing.module';
import { DashboardDockComponent } from './components/dashboard-dock/dashboard-dock.component';
import { DashboardWorkspaceComponent } from './components/dashboard-workspace/dashboard-workspace.component';
import { DashboardWidget } from './components/dashboard-widget/dashboard-widget.component';
import { FilesWidgetComponent } from './components/widgets/files-widget/files-widget.component';
import { ClockWidgetComponent } from './components/widgets/clock-widget/clock-widget.component';
import { CalendarWidgetComponent } from './components/widgets/calendar-widget/calendar-widget.component';
import { DashboardWidgetTemplateComponent } from './components/dashboard-widget-template/dashboard-widget-template.component';
import { DashboardWidgetPropertiesComponent } from './components/dashboard-widget-properties/dashboard-widget-properties.component';
import { DashboardUnknownWidgetTypeComponent } from './components/widgets/dashboard-unknown-widget-type/dashboard-unknown-widget-type.component';


@NgModule({
  declarations: [
    DashboardMainComponent,
    DashboardDockComponent,
    DashboardWorkspaceComponent,
    DashboardWidget,
    FilesWidgetComponent,
    ClockWidgetComponent,
    CalendarWidgetComponent,
    DashboardWidgetTemplateComponent,
    DashboardWidgetPropertiesComponent,
    DashboardUnknownWidgetTypeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModSessionModule,
    ModFilesDataModule,
    ModDashboardRoutingModule
  ],
  exports: [
    DashboardMainComponent,
    ModDashboardRoutingModule
  ]
})
export class ModDashboardModule { }
