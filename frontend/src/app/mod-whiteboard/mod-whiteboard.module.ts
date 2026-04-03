import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModFilesModule } from '../mod-files/mod-files.module';
import { ModWhiteboardRoutingModule } from './whiteboard-routing.module';

import { WhiteboardEditorComponent } from './components/whiteboard-editor/whiteboard-editor.component';
import { WhiteboardShapeContextMenuComponent } from './components/whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { WhiteboardRootContextMenuComponent } from './components/whiteboard-root-context-menu/whiteboard-root-context-menu.component';
import { WhiteboardSiderbarComponent } from './components/whiteboard-sidebar/whiteboard-siderbar.component';
import { WhiteboardOverviewComponent } from './components/whiteboard-overview/whiteboard-overview.component';
import { WhiteboardBgImageSelectorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-bg-image-selector/whiteboard-bg-image-selector.component';
import { WhiteboardBgGradientSelectorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-bg-gradient-selector/whiteboard-bg-gradient-selector.component';
import { WhiteboardBgColorSelectorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-bg-color-selector/whiteboard-bg-color-selector.component';
import { WhiteboardLinestyleSelectorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-linestyle-selector/whiteboard-linestyle-selector.component';
import { WhiteboardPosSizeSelectorComponent } from './components/whiteboard-sidebar/property-editors/whiteboard-pos-size-selector/whiteboard-pos-size-selector.component';


@NgModule({
  declarations: [
    WhiteboardEditorComponent,
    WhiteboardShapeContextMenuComponent,
    WhiteboardRootContextMenuComponent,
    WhiteboardSiderbarComponent,
    WhiteboardOverviewComponent,
    WhiteboardBgImageSelectorComponent,
    WhiteboardBgGradientSelectorComponent,
    WhiteboardBgColorSelectorComponent,
    WhiteboardLinestyleSelectorComponent,
    WhiteboardPosSizeSelectorComponent
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
  ],
  exports: [
    WhiteboardOverviewComponent
  ]
})
export class ModWhiteboardModule { }
