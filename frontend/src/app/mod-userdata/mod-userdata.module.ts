import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';

import { IUser, User } from './models/user';
export { IUser, User }

import { IGroup, Group } from './models/group';
export { IGroup, Group }

import { AvatarService } from './services/avatar.service';
export { AvatarService }

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModCommonsModule
  ]
})
export class ModUserDataModule { 
  
}
