import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { WhiteboardMainComponent } from './components/whiteboard-main/whiteboard-main.component';

import { SessionRequiredGuard } from '../mod-session/session.module';
import { WhiteboardEditorComponent } from "./components/whiteboard-editor/whiteboard-editor.component";


const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'main'
  // },
  {
    path: 'folderview',
    component: WhiteboardMainComponent,
    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'edit',
    component: WhiteboardEditorComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModWhiteboardRoutingModule {

}
