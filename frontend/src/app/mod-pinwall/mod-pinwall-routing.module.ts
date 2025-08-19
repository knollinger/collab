import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PinwallMainComponent } from './components/pinwall-main/pinwall-main.component';
import { SessionRequiredGuard } from "../mod-session/session.module";
import { PostitTextEditorComponent } from "./components/postit-text-editor/postit-text-editor.component";
import { PostitListEditorComponent } from "./components/postit-list-editor/postit-list-editor.component";

const routes: Routes = [
    {
        path: 'main',
        component: PinwallMainComponent,
        canActivate: [SessionRequiredGuard],
    },
    {
        path: 'edit/text/:uuid',
        component: PostitTextEditorComponent,
        canActivate: [SessionRequiredGuard],
    },
    {
        path: 'edit/text',
        component: PostitTextEditorComponent,
        canActivate: [SessionRequiredGuard],
    },
    {
        path: 'edit/list/:uuid',
        component: PostitListEditorComponent,
        canActivate: [SessionRequiredGuard],
    },
    {
        path: 'edit/list',
        component: PostitListEditorComponent,
        canActivate: [SessionRequiredGuard],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModPinwallRoutingModule {

}
