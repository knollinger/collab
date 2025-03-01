import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { ModUserModule } from '../mod-user/mod-user.module';

import { SessionService } from './services/session.service';
export { SessionService }

import { SessionRequiredGuard } from './guards/session-required.guard';
export { SessionRequiredGuard };


import { SessionMenuComponent } from './components/session-menu/session-menu.component';
import { LoginComponent } from './components/login/login.component';

import { SessionRoutingModule } from './session-routing.module';
import { EditProfileComponent } from '../mod-user/components/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    SessionMenuComponent,
    LoginComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModMaterialImportModule,
    ModUserModule,
    SessionRoutingModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    SessionMenuComponent,
    SessionRoutingModule,
    LoginComponent
  ]
})
export class ModSessionModule { }
