import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';

import { HashTagService } from './services/hash-tag.service';
export { HashTagService };

import { HashTagSelectorComponent } from './components/hashtag-selector/hashtag-selector.component';

@NgModule({
  declarations: [
    HashTagSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    ModMaterialImportModule,
    ModCommonsModule
  ],
  exports: [
    HashTagSelectorComponent
  ]
})
export class ModHashTagsModule { 

}
