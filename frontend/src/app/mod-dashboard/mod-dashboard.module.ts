import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModSessionModule } from '../mod-session/session.module';

import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { ModDashboardRoutingModule } from './mod-dashboard-routing.module';
import { DashboardDockComponent } from './components/dashboard-dock/dashboard-dock.component';
import { DashboardWorkspaceComponent } from './components/dashboard-workspace/dashboard-workspace.component';



@NgModule({
  declarations: [
    DashboardMainComponent,
    DashboardDockComponent,
    DashboardWorkspaceComponent
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModSessionModule,
    ModDashboardRoutingModule
  ],
  exports: [
    DashboardMainComponent,
    ModDashboardRoutingModule
  ]
})
export class ModDashboardModule { }
