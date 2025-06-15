import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SessionRequiredGuard } from '../mod-session/session.module';

import { UserMainEditComponent } from './components/user-main-edit/user-main-edit.component';
import { GroupEditComponent } from './components/group-edit/group-edit.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserMainEditComponent,
    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'editUser/:userId',
    component: UserEditComponent,
    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'groups',
    component: GroupEditComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {

}
