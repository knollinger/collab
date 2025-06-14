import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';

import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';

const routes: Routes = [
  {
    path: 'show',
    component: DashboardMainComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModDashboardRoutingModule {

}
