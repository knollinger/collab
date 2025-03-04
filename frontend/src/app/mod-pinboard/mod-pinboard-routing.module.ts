import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';

import { PinboardMainViewComponent } from "./components/pinboard-main-view/pinboard-main-view.component";

const routes: Routes = [
  {
    path: '',
    component: PinboardMainViewComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModPinboardRoutingModule {

}
