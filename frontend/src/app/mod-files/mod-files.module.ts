import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModCommonsModule } from '../mod-commons/mod-commons.module';
import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { FilesMainViewComponent } from './components/files-main-view/files-main-view.component';

import { ModFilesRoutingModule } from './mod-files-routing.module';
import { FilesGridViewItemComponent } from './components/files-grid-view-item/files-grid-view-item.component';
import { FilesPropertiesDialogComponent, FilesPropertiesCommonsComponent } from './components/files-properties-dialog/files-properties-dialog.component';
import { FilesBreadCrumbItemComponent } from './components/files-bread-crumb-item/files-bread-crumb-item.component';
import { FilesFolderViewComponent } from './components/files-folder-view/files-folder-view.component';
import { FilesGridViewComponent } from './components/files-grid-view/files-grid-view.component';
import { FilesListViewComponent } from './components/files-list-view/files-list-view.component';
import { ShowDuplicateFilesComponent } from './components/show-duplicate-files/show-duplicate-files.component';
import { FilesPreviewComponent } from './components/files-preview/files-preview.component';
import { FilesContextMenuComponent } from './components/files-context-menu/files-context-menu.component';
import { INodeDragSourceDirective } from './directives/inode-drag-source.directive';
import { DropTargetDirective } from './directives/drop-target.directive';

@NgModule({
  declarations: [
    FilesMainViewComponent,
    FilesGridViewItemComponent,
    FilesPropertiesDialogComponent,
    FilesPropertiesCommonsComponent,
    FilesFolderViewComponent,
    FilesBreadCrumbItemComponent,
    FilesGridViewComponent,
    FilesListViewComponent,
    ShowDuplicateFilesComponent,
    FilesPreviewComponent,
    FilesContextMenuComponent,
    INodeDragSourceDirective,
    DropTargetDirective,
  ],
  imports: [
    CommonModule,
    ModCommonsModule,
    ModMaterialImportModule,
    ModFilesRoutingModule
  ],
  exports: [
    FilesMainViewComponent,
    ModFilesRoutingModule

  ]
})
export class ModFilesModule { 

}
