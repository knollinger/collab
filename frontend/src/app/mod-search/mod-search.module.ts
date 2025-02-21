import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { SearchBarComponent } from './components/search-bar/search-bar.component';



@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    ModMaterialImportModule
  ],
  exports: [
    SearchBarComponent
  ]
})
export class ModSearchModule { }
