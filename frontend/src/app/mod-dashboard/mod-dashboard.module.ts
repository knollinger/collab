import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { ModDashboardRoutingModule } from './mod-dashboard-routing.module';
import { DashboardButtonComponent } from './components/dashboard-button/dashboard-button.component';



@NgModule({
  declarations: [
    DashboardMainComponent,
    DashboardButtonComponent
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModDashboardRoutingModule
  ],
  exports: [
    DashboardMainComponent,
    ModDashboardRoutingModule
  ]
})
export class ModDashboardModule { }
