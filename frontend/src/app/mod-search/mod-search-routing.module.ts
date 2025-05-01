import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';

import { SearchMainComponent } from './components/search-main/search-main.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    component: SearchMainComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModSearchRoutingModule {

}
