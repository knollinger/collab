import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModFilesModule } from '../mod-files/mod-files.module';
import { ModQuillModule } from '../mod-quill/mod-quill.module';
import { ModWhiteboardRoutingModule } from './whiteboard-routing.module';

import { WhiteboardEditorComponent } from './components/whiteboard-editor/whiteboard-editor.component';
import { WhiteboardShapeContextMenuComponent } from './components/whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { WhiteboardRootContextMenuComponent } from './components/whiteboard-root-context-menu/whiteboard-root-context-menu.component';
import { WhiteboardSiderbarComponent } from './components/whiteboard-sidebar/whiteboard-siderbar.component';
import { WhiteboardOverviewComponent } from './components/whiteboard-overview/whiteboard-overview.component';
import { WhiteboardBgImageEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-bg-image-editor/whiteboard-bg-image-editorcomponent';
import { WhiteboardBgGradientEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-bg-gradient-editor/whiteboard-bg-gradient-editorcomponent';
import { WhiteboardBgColorEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-bg-color-editor/whiteboard-bg-color-editor.component';
import { WhiteboardLinestyleEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-linestyle-editor/whiteboard-linestyle-editor.component';
import { WhiteboardPosSizeEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-pos-size-editor/whiteboard-pos-size-editorcomponent';
import { WhiteboardTextEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-text-editor/whiteboard-text-editor.component';
import { WhiteboardZorderEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-zorder-editor/whiteboard-zorder-editor.component';


@NgModule({
  declarations: [
    WhiteboardEditorComponent,
    WhiteboardShapeContextMenuComponent,
    WhiteboardRootContextMenuComponent,
    WhiteboardSiderbarComponent,
    WhiteboardOverviewComponent,
    WhiteboardBgImageEditorComponent,
    WhiteboardBgGradientEditorComponent,
    WhiteboardBgColorEditorComponent,
    WhiteboardLinestyleEditorComponent,
    WhiteboardPosSizeEditorComponent,
    WhiteboardTextEditorComponent,
    WhiteboardZorderEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModSessionModule,
    ModFilesModule,
    ModQuillModule,
    ModWhiteboardRoutingModule
  ],
  exports: [
    WhiteboardOverviewComponent
  ]
})
export class ModWhiteboardModule { }
