import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModWhiteboardRoutingModule } from './whiteboard-routing.module';

import { WhiteboardMainComponent } from './components/whiteboard-main/whiteboard-main.component';
import { WhiteboardEditorComponent } from './components/whiteboard-editor/whiteboard-editor.component';
import { WhiteboardContextMenuComponent } from './components/whiteboard-context-menu/whiteboard-context-menu.component';


@NgModule({
  declarations: [
    WhiteboardMainComponent,
    WhiteboardEditorComponent,
    WhiteboardContextMenuComponent
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModSessionModule,
    ModWhiteboardRoutingModule
  ]
})
export class ModWhiteboardModule { }
