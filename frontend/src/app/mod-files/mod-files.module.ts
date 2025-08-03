import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModUserDataModule } from '../mod-userdata/mod-userdata.module';
import { ModFilesDataModule } from '../mod-files-data/mod-files-data.module';
import { ModSettingsModule } from '../mod-settings/mod-settings.module';

import { ModHashTagsModule } from '../mod-hashtags/mod-hashtags.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { FilesMainViewComponent } from './components/files-main-view/files-main-view.component';
import { FilesFrameSelectorComponent } from './components/files-frame-selector/files-frame-selector.component';
import { FilesPlacesComponent } from './components/files-places/files-places.component';
import { FilePickerComponent } from './components/files-picker/files-picker.component';

import { ModFilesRoutingModule } from './mod-files-routing.module';
import { FilesGridViewItemComponent } from './components/files-grid-view-item/files-grid-view-item.component';
import { FilesPropertiesDialogComponent } from './components/files-properties-dialog/files-properties-dialog.component';
import { FilesPropertiesCommonsComponent } from './components/files-properties-dialog/files-properties-commons.component';
import { FilesPropertiesPermissionsComponent } from './components/files-properties-dialog/files-properties-permissions.component';
import { FilesBreadCrumbItemComponent } from './components/files-bread-crumb-item/files-bread-crumb-item.component';
import { FilesFolderViewComponent } from './components/files-folder-view/files-folder-view.component';
import { FilesGridViewComponent } from './components/files-grid-view/files-grid-view.component';
import { FilesListViewComponent } from './components/files-list-view/files-list-view.component';
import { FilesItemContextMenuComponent } from './components/files-item-context-menu/files-item-context-menu.component';
import { INodeDragSourceDirective } from './directives/inode-drag-source.directive';
import { DropTargetDirective } from './directives/drop-target.directive';
import { FilesFolderContextMenuComponent } from './components/files-folder-context-menu/files-folder-context-menu.component';
import { FileDropINodeMenuComponent } from './components/files-inode-drop-menu/files-inode-drop-menu.component';
import { FilesIconsizeMenuComponent } from './components/files-iconsize-menu/files-iconsize-menu.component';
import { FilesListViewItemComponent } from './components/files-listview-item/files-listview-item.component';
import { FilesPermissionsComponent } from './components/files-permissions/files-permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesCreateMenuComponent } from './components/files-create-menu/files-create-menu.component';
import { FilesShowDuplicatesComponent } from './components/files-show-duplicates/files-show-duplicates.component';

import { INodeService } from './services/inode.service';
export { INodeService };

import { FilesPickerService } from './services/files-picker.service';
export { FilesPickerService }

import { WopiService } from './services/wopi.service';
import { ModSessionModule } from '../mod-session/session.module';
export { WopiService };

@NgModule({
  declarations: [
    FilesMainViewComponent,
    FilesGridViewItemComponent,
    FilesPropertiesDialogComponent,
    FilesPropertiesCommonsComponent,
    FilesPropertiesPermissionsComponent,
    FilesFolderViewComponent,
    FilesBreadCrumbItemComponent,
    FilesGridViewComponent,
    FilesListViewComponent,
    FilesItemContextMenuComponent,
    INodeDragSourceDirective,
    DropTargetDirective,
    FilesFolderContextMenuComponent,
    FileDropINodeMenuComponent,
    FilesIconsizeMenuComponent,
    FilesListViewItemComponent,
    FilesPermissionsComponent,
    FilesCreateMenuComponent,
    FilesShowDuplicatesComponent,
    FilesFrameSelectorComponent,
    FilesPlacesComponent,
    FilePickerComponent,
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModFilesDataModule,
    ModUserDataModule,
    ModHashTagsModule,
    ModSettingsModule,
    ModSessionModule,
    ModMaterialImportModule,
    FormsModule,
    ReactiveFormsModule,
    ModFilesRoutingModule
  ],
  exports: [
    FilesMainViewComponent,
    FilePickerComponent,
    FilesGridViewComponent,
    FilesGridViewItemComponent,
    FilesListViewComponent,
    FilesListViewItemComponent,
    DropTargetDirective,
    ModFilesRoutingModule

  ]
})
export class ModFilesModule {

}
