import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SessionRequiredGuard } from '../mod-session/session.module';

import { UserMainViewComponent } from './components/user-main-view/user-main-view.component';

const routes: Routes = [
  {
    path: '',
    component: UserMainViewComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {

}
