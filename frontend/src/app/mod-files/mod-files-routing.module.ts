import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SessionRequiredGuard } from '../mod-session/session.module';

import { FilesMainViewComponent } from './components/files-main-view/files-main-view.component';
import { FilesPreviewComponent } from './components/files-preview/files-preview.component';

const routes: Routes = [
  {
    path: 'main',
    component: FilesMainViewComponent,
    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'main/:leftPanel',
    component: FilesMainViewComponent,
    canActivate: [SessionRequiredGuard],
  },
  
  {
    path: 'main/:leftPanel/:rightPanel',
    component: FilesMainViewComponent,
    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'preview/:uuid',
    component: FilesPreviewComponent,
    canActivate: [SessionRequiredGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModFilesRoutingModule {

}
