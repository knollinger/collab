import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';
import { WhiteboardEditorComponent } from "./components/whiteboard-editor/whiteboard-editor.component";
import { WhiteboardOverviewComponent } from "./components/whiteboard-overview/whiteboard-overview.component";


const routes: Routes = [
  {
    path: 'overview',
    component: WhiteboardOverviewComponent,
    canActivate: [SessionRequiredGuard]
  },
  {
    path: 'edit',
    component: WhiteboardEditorComponent,
    canActivate: [SessionRequiredGuard],
  },
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
