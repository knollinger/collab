import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";


import { SessionRequiredGuard } from '../mod-session/session.module';
import { ViewerImageComponent } from "./components/viewer-image/viewer-image.component";
import { ViewerMovieComponent } from "./components/viewer-movie/viewer-movie.component";
import { ViewerQuillComponent } from "./components/viewer-quill/viewer-quill.component";
import { ViewerCollabaraComponent } from "./components/viewer-collabara/viewer-collabara.component";
import { ViewerAudioComponent } from "./components/viewer-audio/viewer-audio.component";

const routes: Routes = [
    {
        path: 'image/:uuid',
        component: ViewerImageComponent,
        canActivate: [SessionRequiredGuard]
    },
    {
        path: 'video/:uuid',
        component: ViewerMovieComponent,
        canActivate: [SessionRequiredGuard]
    },
    {
        path: 'audio/:uuid',
        component: ViewerAudioComponent,
        canActivate: [SessionRequiredGuard]
    },
    {
        path: 'quill/:uuid',
        component: ViewerQuillComponent,
        canActivate: [SessionRequiredGuard]
    },
    {
        path: 'collabora/:uuid',
        component: ViewerCollabaraComponent,
        canActivate: [SessionRequiredGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModFilesViewerRoutingModule {

}
