import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';

import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';

const routes: Routes = [
  {
    path: 'show',
    component: CalendarMainComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModCalendarRoutingModule {

}
