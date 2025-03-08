import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser, User } from './models/user';
export { IUser, User };

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { AvatarSelectorComponent } from './components/avatar-selector/avatar-selector.component';
import { UserRoutingModule } from './user-routing.module';

import { UserService } from './services/user.service';
export { UserService }

import { UserMainViewComponent } from './components/user-main-view/user-main-view.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';

@NgModule({
  declarations: [
    AvatarSelectorComponent,
    UserMainViewComponent,
    UserEditComponent,
    UserSelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
