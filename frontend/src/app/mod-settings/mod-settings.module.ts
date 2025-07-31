import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { SettingsMainComponent } from './components/settions-main/settings-main.component';

import { SettingsService } from './services/settings.service';
export { SettingsService }

@NgModule({
  declarations: [
    SettingsMainComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModCommonsModule,
    ModMaterialImportModule,
  ],
  exports: [
  ]
})
export class ModSettingsModule { }
