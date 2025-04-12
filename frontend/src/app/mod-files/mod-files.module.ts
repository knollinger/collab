import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModUserDataModule } from '../mod-userdata/mod-userdata.module';
import { ModHashTagsModule } from '../mod-hashtags/mod-hashtags.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { FilesMainViewComponent } from './components/files-main-view/files-main-view.component';

import { ModFilesRoutingModule } from './mod-files-routing.module';
import { FilesGridViewItemComponent } from './components/files-grid-view-item/files-grid-view-item.component';
import { FilesPropertiesDialogComponent } from './components/files-properties-dialog/files-properties-dialog.component';
import { FilesPropertiesCommonsComponent } from './components/files-properties-dialog/files-properties-commons.component';
import { FilesPropertiesPermissionsComponent } from './components/files-properties-dialog/files-properties-permissions.component';
import { FilesBreadCrumbItemComponent } from './components/files-bread-crumb-item/files-bread-crumb-item.component';
import { FilesFolderViewComponent } from './components/files-folder-view/files-folder-view.component';
import { FilesGridViewComponent } from './components/files-grid-view/files-grid-view.component';
import { FilesListViewComponent } from './components/files-list-view/files-list-view.component';
import { ShowDuplicateFilesComponent } from './components/show-duplicate-files/show-duplicate-files.component';
import { FilesPreviewComponent } from './components/files-preview/files-preview.component';
import { FilesItemContextMenuComponent } from './components/files-item-context-menu/files-item-context-menu.component';
import { INodeDragSourceDirective } from './directives/inode-drag-source.directive';
import { DropTargetDirective } from './directives/drop-target.directive';
import { FilesFolderContextMenuComponent } from './components/files-folder-context-menu/files-folder-context-menu.component';
import { FileDropINodeMenuComponent } from './components/files-inode-drop-menu/files-inode-drop-menu.component';
import { FilesIconsizeMenuComponent } from './components/files-iconsize-menu/files-iconsize-menu.component';
import { FilesListviewItemComponent } from './components/files-listview-item/files-listview-item.component';
import { FilesPermissionsComponent } from './components/files-permissions/files-permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesFolderviewToolbarComponent } from './components/files-folderview-toolbar/files-folderview-toolbar.component';
import { FilesHashtagsComponent } from './components/files-properties-dialog/files-hashtags.component';
import { FilesCreateMenuComponent } from './components/files-create-menu/files-create-menu.component';

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
    ShowDuplicateFilesComponent,
    FilesPreviewComponent,
    FilesItemContextMenuComponent,
    INodeDragSourceDirective,
    DropTargetDirective,
    FilesFolderContextMenuComponent,
    FileDropINodeMenuComponent,
    FilesIconsizeMenuComponent,
    FilesListviewItemComponent,
    FilesPermissionsComponent,
    FilesFolderviewToolbarComponent,
    FilesHashtagsComponent,
    FilesCreateMenuComponent,
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModUserDataModule,
    ModHashTagsModule,
    ModMaterialImportModule,
    FormsModule,
    ReactiveFormsModule,
    ModFilesRoutingModule
  ],
  exports: [
    FilesMainViewComponent,
    ModFilesRoutingModule

  ]
})
export class ModFilesModule { 

}
