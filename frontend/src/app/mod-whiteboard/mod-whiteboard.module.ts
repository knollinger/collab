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
import { WhiteboardLinestyleEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-linestyle-editor/whiteboard-linestyle-editor.component';
import { WhiteboardPosSizeEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-pos-size-editor/whiteboard-pos-size-editorcomponent';
import { WhiteboardTextEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-text-editor/whiteboard-text-editor.component';
import { WhiteboardFillEffectEditorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-fill-effect-editor/whiteboard-fill-effect-editor.component';
import { WhiteboardFillEffectColorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-fill-effect-editor/whiteboard-fill-effect-color.component';
import { WhiteboardFillEffectGradientComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-fill-effect-editor/whiteboard-fill-effect-gradient.component';
import { WhiteboardFillEffectImageComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-fill-effect-editor/whiteboard-fill-effect-image.component';
import { WhiteboardFillEffectPatternComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-fill-effect-editor/whiteboard-fill-effect-pattern.component';


@NgModule({
  declarations: [
    WhiteboardEditorComponent,
    WhiteboardShapeContextMenuComponent,
    WhiteboardRootContextMenuComponent,
    WhiteboardSiderbarComponent,
    WhiteboardOverviewComponent,
    WhiteboardLinestyleEditorComponent,
    WhiteboardPosSizeEditorComponent,
    WhiteboardTextEditorComponent,
    WhiteboardFillEffectEditorComponent,
    WhiteboardFillEffectColorComponent,
    WhiteboardFillEffectGradientComponent,
    WhiteboardFillEffectImageComponent,
    WhiteboardFillEffectPatternComponent
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
