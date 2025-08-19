import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { PinwallMainComponent } from './components/pinwall-main/pinwall-main.component';
import { ModPinwallRoutingModule } from './mod-pinwall-routing.module';
import { BucketListComponent } from './components/bucket-list/bucket-list.component';
import { BucketListItemComponent } from './components/bucket-list/bucket-list-item.component';
import { PostitTextEditorComponent } from './components/postit-text-editor/postit-text-editor.component';
import { PostitListEditorComponent } from './components/postit-list-editor/postit-list-editor.component';

/**
 * 
 */
@NgModule({
  declarations: [
    PinwallMainComponent,
    BucketListComponent,
    BucketListItemComponent,
    PostitTextEditorComponent,
    PostitListEditorComponent,
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
