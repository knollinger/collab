import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';

import { ViewerChooserComponent } from './components/viewer-chooser/viewer-chooser.component';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { FilesViewerComponent } from './components/files-viewer/files-viewer.component';
import { ViewerCollabaraComponent } from './components/viewer-collabara/viewer-collabara.component';
import { ModFilesViewerRoutingModule } from './mod-files-viewer-routing.module';
import { ViewerQuillComponent } from './components/viewer-quill/viewer-quill.component';

@NgModule({
  declarations: [
    ViewerChooserComponent,
    FilesViewerComponent,
    ViewerCollabaraComponent,
    ViewerQuillComponent
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModSessionModule,
    ModMaterialImportModule,
    ModFilesViewerRoutingModule
  ],
  exports: [
    ViewerChooserComponent,
    ModFilesViewerRoutingModule
  ]
})
export class ModFilesViewerModule { }
