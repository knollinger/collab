import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { User } from './models/user';
export { User };

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { AvatarSelectorComponent } from './components/avatar-selector/avatar-selector.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { UserRoutingModule } from './user-routing.module';

import { UserService } from './services/user.service';
export { UserService }

@NgModule({
  declarations: [
    AvatarSelectorComponent,
    ListUserComponent,
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModMaterialImportModule,
    UserRoutingModule
  ],
  exports: [
    AvatarSelectorComponent,
    UserRoutingModule
  ]
})
export class ModUserModule { }
