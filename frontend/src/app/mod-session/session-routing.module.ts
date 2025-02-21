import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [SessionRequiredGuard],
  },
  {
    path: 'changePasswd',
    component: LoginComponent,
    // canActivate: [SessionRequiredGuard],
  }  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule {

}
