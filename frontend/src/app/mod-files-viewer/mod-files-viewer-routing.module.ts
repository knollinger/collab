import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { FilesViewerComponent } from './components/files-viewer/files-viewer.component';

import { SessionRequiredGuard } from '../mod-session/session.module';

const routes: Routes = [
    {
        path: 'show/:uuid',
        component: FilesViewerComponent,
        canActivate: [SessionRequiredGuard],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModFilesViewerRoutingModule {

}
