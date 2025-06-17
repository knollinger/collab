import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModUserDataModule } from '../mod-userdata/mod-userdata.module';
import { ModSessionModule } from '../mod-session/session.module';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { AvatarSelectorComponent } from './components/avatar-selector/avatar-selector.component';
import { UserRoutingModule } from './user-routing.module';

import { UserService } from './services/user.service';
export { UserService }

import { GroupService } from './services/group.service';
export { GroupService }

import { UserMainEditComponent } from './components/user-main-edit/user-main-edit.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { GroupSelectorComponent } from './components/group-selector/group-selector.component';
import { GroupEditComponent } from './components/group-edit/group-edit.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { GroupTreeComponent } from './components/group-tree/group-tree.component';

@NgModule({
  declarations: [
    AvatarSelectorComponent,
    UserMainEditComponent,
    UserSelectorComponent,
    UserEditComponent,
    GroupSelectorComponent,
    GroupEditComponent,
    GroupTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModCommonsModule,
    ModUserDataModule,
    ModSessionModule,
    ModMaterialImportModule,
    UserRoutingModule
  ],
  exports: [
    AvatarSelectorComponent,
    UserRoutingModule
  ]
})
export class ModUserModule { }
