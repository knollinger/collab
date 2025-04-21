import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';

import { SessionRequiredGuard } from '../mod-session/session.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    component: CalendarMainComponent,
    canActivate: [SessionRequiredGuard],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModCalendarRoutingModule {

}
