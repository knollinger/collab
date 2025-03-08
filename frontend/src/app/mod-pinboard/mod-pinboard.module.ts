import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModUserDataModule } from '../mod-userdata/mod-userdata.module';

import { PinboardMainViewComponent } from './components/pinboard-main-view/pinboard-main-view.component';
import { PinboardNewComponent } from './components/pinboard-new/pinboard-new.component';
import { PinboardListComponent } from './components/pinboard-list/pinboard-list.component';

import { ModPinboardRoutingModule } from './mod-pinboard-routing.module';
import { PinboardCardComponent } from './components/pinboard-card/pinboard-card.component';

@NgModule({
  declarations: [
    PinboardMainViewComponent,
    PinboardNewComponent,
    PinboardListComponent,
    PinboardCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModCommonsModule,
    ModUserDataModule,
    ModMaterialImportModule
  ],
  exports: [
    ModPinboardRoutingModule
  ]
})
export class ModPinboardModule { }
