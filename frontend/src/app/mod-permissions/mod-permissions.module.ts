import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModSessionModule } from '../mod-session/session.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { EACLEntryType, IACLEntry, ACLEntry, IACL, ACL } from './models/acl';
export { EACLEntryType, IACLEntry ,ACLEntry, IACL, ACL };

import { AclEditorComponent } from './components/acl-editor/acl-editor.component';
import { AclEntryOwnerSelectorComponent } from './components/aclentry-owner-selector/aclentry-owner-selector.component';

import { PermissionsService } from './services/permissions.service';
export { PermissionsService }

import { CheckPermissionsService } from './services/check-permissions.service';
export { CheckPermissionsService }

@NgModule({
  declarations: [
    AclEditorComponent,
    AclEntryOwnerSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModSessionModule,
    ModMaterialImportModule
  ],
  exports: [
    AclEditorComponent,
    AclEntryOwnerSelectorComponent
  ]
})
export class ModPermissionsModule { }
