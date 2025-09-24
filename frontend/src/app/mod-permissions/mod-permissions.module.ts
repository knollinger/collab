import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModSessionModule } from '../mod-session/session.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { EACLEntryType, IACLEntry, ACLEntry, IACL, ACL } from './models/acl';
export { EACLEntryType, IACLEntry ,ACLEntry, IACL, ACL };

import { PermissionListComponent } from './components/permission-list/permission-list.component';

@NgModule({
  declarations: [
    PermissionListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModSessionModule,
    ModMaterialImportModule
  ],
  exports: [
    PermissionListComponent
  ]
})
export class ModPermissionsModule { }
