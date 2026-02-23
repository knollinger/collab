import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModFilesModule } from '../mod-files/mod-files.module';
import { ModWhiteboardRoutingModule } from './whiteboard-routing.module';

import { WhiteboardMainComponent } from './components/whiteboard-main/whiteboard-main.component';
import { WhiteboardEditorComponent } from './components/whiteboard-editor/whiteboard-editor.component';
import { WhiteboardShapeContextMenuComponent } from './components/whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { WhiteboardRootContextMenuComponent } from './components/whiteboard-root-context-menu/whiteboard-root-context-menu.component';
import { WhiteboardSiderbarComponent } from './components/whiteboard-siderbar/whiteboard-siderbar.component';


@NgModule({
  declarations: [
    WhiteboardMainComponent,
    WhiteboardEditorComponent,
    WhiteboardShapeContextMenuComponent,
    WhiteboardRootContextMenuComponent,
    WhiteboardSiderbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModSessionModule,
    ModFilesModule,
    ModWhiteboardRoutingModule
  ]
})
export class ModWhiteboardModule { }
