import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

//import { SessionRequiredGuard } from '../mod-session/session.module';

import { ListUserComponent } from './components/list-user/list-user.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ListUserComponent,
//    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'editProfile/:uuid',
    component: EditProfileComponent,
//    canActivate: [SessionRequiredGuard],
  },  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {

}
