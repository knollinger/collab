import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { PinwallMainComponent } from './components/pinwall-main/pinwall-main.component';
import { ModPinwallRoutingModule } from './mod-pinwall-routing.module';
import { PinwallEditorComponent } from './components/pinwall-editor/pinwall-editor.component';

/**
 * 
 */
@NgModule({
  declarations: [
    PinwallMainComponent,
    PinwallEditorComponent
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModSessionModule,
    ModPinwallRoutingModule
  ]
})
export class ModPinwallModule { 
  
}
