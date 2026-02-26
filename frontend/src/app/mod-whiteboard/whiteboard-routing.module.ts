import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';
import { WhiteboardEditorComponent } from "./components/whiteboard-editor/whiteboard-editor.component";


const routes: Routes = [
  {
    path: 'edit/:uuid',
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
