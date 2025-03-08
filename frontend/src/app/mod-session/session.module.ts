import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModUserDataModule } from '../mod-userdata/mod-userdata.module';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { SessionService } from './services/session.service';
export { SessionService }

import { SessionRequiredGuard } from './guards/session-required.guard';
export { SessionRequiredGuard };

import { SessionMenuComponent } from './components/session-menu/session-menu.component';
import { LoginComponent } from './components/login/login.component';

import { SessionRoutingModule } from './session-routing.module';

@NgModule({
  declarations: [
    SessionMenuComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModMaterialImportModule,
    ModUserDataModule,
    SessionRoutingModule
  ],
  exports: [
    SessionMenuComponent,
    SessionRoutingModule
  ]
})
export class ModSessionModule { }
