import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ErrorPageComponent } from "./components/error-page/error-page.component";

const routes: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModCommonsRoutingModule {

}
