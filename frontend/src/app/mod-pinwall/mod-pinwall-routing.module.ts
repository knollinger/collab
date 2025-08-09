import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PinwallMainComponent } from './components/pinwall-main/pinwall-main.component';
import { PinwallEditorComponent } from './components/pinwall-editor/pinwall-editor.component';
import { SessionRequiredGuard } from "../mod-session/session.module";

const routes: Routes = [
    {
        path: 'main',
        component: PinwallMainComponent,
        canActivate: [SessionRequiredGuard],
    },
    {
        path: 'edit/:uuid',
        component: PinwallEditorComponent,
        canActivate: [SessionRequiredGuard],
    },
    {
        path: 'edit',
        component: PinwallEditorComponent,
        canActivate: [SessionRequiredGuard],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModPinwallRoutingModule {

}
