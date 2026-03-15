import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModUserDataModule } from '../mod-userdata/mod-userdata.module';
import { ModFilesDataModule } from '../mod-files-data/mod-files-data.module';
import { ModSettingsModule } from '../mod-settings/mod-settings.module';

import { ModHashTagsModule } from '../mod-hashtags/mod-hashtags.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';
import { ModPermissionsModule } from '../mod-permissions/mod-permissions.module';
import { ModSessionModule } from '../mod-session/session.module';
import { ModFilesRoutingModule } from './mod-files-routing.module';

import { FilesMainViewComponent } from './components/files-main-view/files-main-view.component';
import { FilesPlacesComponent } from './components/files-places/files-places.component';
import { FilePickerComponent } from './components/files-picker/files-picker.component';
import { FilesPropertiesDialogComponent } from './components/files-properties-dialog/files-properties-dialog.component';
import { FilesPropertiesCommonsComponent } from './components/files-properties-dialog/files-properties-commons.component';
import { FilesPropertiesPermissionsComponent } from './components/files-properties-dialog/files-properties-permissions.component';
import { FilesBreadCrumbItemComponent } from './components/files-bread-crumb-item/files-bread-crumb-item.component';
import { FilesFolderViewComponent } from './components/files-folder-view/files-folder-view.component';
import { FilesItemContextMenuComponent } from './components/files-item-context-menu/files-item-context-menu.component';
import { INodeDragSourceDirective } from './directives/inode-drag-source.directive';
import { DropTargetDirective } from './directives/drop-target.directive';
import { FilesFolderContextMenuComponent } from './components/files-folder-context-menu/files-folder-context-menu.component';
import { FileDropINodeMenuComponent } from './components/files-inode-drop-menu/files-inode-drop-menu.component';
import { FilesPermissionsComponent } from './components/files-permissions/files-permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesCreateMenuComponent } from './components/files-create-menu/files-create-menu.component';
import { FilesShowDuplicatesComponent } from './components/files-show-duplicates/files-show-duplicates.component';

import { INodeService } from './services/inode.service';
export { INodeService };

import { FilesPickerService } from './services/files-picker.service';
export { FilesPickerService }

import { OpenInodeService } from './services/open-inode.service';
export { OpenInodeService }

import { ContentTypeService } from './services/content-type.service';
export { ContentTypeService }

import { ImageThumnailService } from './services/image-thumnail.service';
export { ImageThumnailService }

import { WopiService } from './services/wopi.service';
import { DefaultThumbnailComponent } from './components/thumbnails/default-thumbnail/default-thumbnail.component';
import { ImageThumbnailComponent } from './components/thumbnails/image-thumbnail/image-thumbnail.component';
import { VideoThumbnailComponent } from './components/thumbnails/video-thumbnail/video-thumbnail.component';
import { AudioThumbnailComponent } from './components/thumbnails/audio-thumbnail/audio-thumbnail.component';
import { FilesIconsizeChooserComponent } from './components/files-iconsize-chooser/files-iconsize-chooser.component';
export { WopiService };


@NgModule({
  declarations: [
    FilesMainViewComponent,
    FilesPropertiesDialogComponent,
    FilesPropertiesCommonsComponent,
    FilesPropertiesPermissionsComponent,
    FilesFolderViewComponent,
    FilesBreadCrumbItemComponent,
    FilesItemContextMenuComponent,
    INodeDragSourceDirective,
    DropTargetDirective,
    FilesFolderContextMenuComponent,
    FileDropINodeMenuComponent,
    FilesPermissionsComponent,
    FilesCreateMenuComponent,
    FilesShowDuplicatesComponent,
    FilesPlacesComponent,
    FilePickerComponent,
    DefaultThumbnailComponent,
    ImageThumbnailComponent,
    VideoThumbnailComponent,
    AudioThumbnailComponent,
    FilesIconsizeChooserComponent,
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModFilesDataModule,
    ModUserDataModule,
    ModHashTagsModule,
    ModSettingsModule,
    ModSessionModule,
    ModPermissionsModule,
    ModMaterialImportModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    ModFilesRoutingModule
  ],
  exports: [
    FilesMainViewComponent,
    FilesFolderViewComponent,
    FilePickerComponent,
    DropTargetDirective,
    ModFilesRoutingModule

  ]
})
export class ModFilesModule {

}
