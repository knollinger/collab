import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IINode, INode, EINodeUUIDs } from './models/inode';
export {IINode, INode, EINodeUUIDs};

import { IShowContextMenuEvent} from './models/show-contextmenu-event';
import { ModPermissionsModule } from '../mod-permissions/mod-permissions.module';
export { IShowContextMenuEvent }

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModPermissionsModule
  ]
})
export class ModFilesDataModule { }
