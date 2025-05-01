import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { SearchMainComponent } from './components/search-main/search-main.component';
import { ModSearchRoutingModule } from './mod-search-routing.module';
import { SearchResultItemComponent } from './components/search-result-item/search-result-item.component';


@NgModule({
  declarations: [
    SearchMainComponent,
    SearchResultItemComponent
  ],
  imports: [
    CommonModule,
    ModMaterialImportModule,
    ModSearchRoutingModule
  ],
  exports: [
    ModSearchRoutingModule
  ]
})
export class ModSearchModule { }
