import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeService } from '../../services/inode.service';
import { SessionService } from '../../../mod-session/session.module';

export interface IFilePickerData {
  multiple: boolean,
  current: INode,
  typeFilter: RegExp
}

/**
 * 
 */
@Component({
  selector: 'app-file-picker',
  templateUrl: './files-picker.component.html',
  styleUrls: ['./files-picker.component.css'],
  standalone: false
})
export class FilePickerComponent implements OnInit {

  currentFolder: INode = INode.root();
  childs: INode[] = new Array<INode>();
  selected: Set<INode> = new Set<INode>();

  viewMode: string = 'list';

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private sessSvc: SessionService,
    @Inject(MAT_DIALOG_DATA)
    private data: IFilePickerData) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    const userId = this.sessSvc.currentUser.userId;
    this.inodeSvc.getINode(userId)
      .pipe()
      .subscribe(homeDir => {
        this.currentFolder = homeDir;
      })

    this.loadChilds(userId);
  }

  /**
   * "Open" hat in diesem Kontext eine eigene Bedeutung:
   * 
   * * Wenn die INode ein Verzeichnis betrifft, so wird dorthin navigiert
   * * wenn die INode ein "normales" File betrifft, so wir dessen SelectionState getoggelt
   * 
   * @param inode 
   */
  onOpen(inode: INode) {

    if (inode.isDirectory()) {
      this.currentFolder = inode;
      this.selected.clear();
      this.loadChilds(inode.uuid);
    }
  }

  /** 
   * 
   */
  onSelectionChange(selected: Set<INode>) {
    this.selected = selected;
  }

  /**
   * 
   * @returns 
   */
  hasSelection(): boolean {
    return this.selected.size > 0;
  }

  /**
   * 
   * @param parentUUID 
   */
  private loadChilds(parentUUID: string) {

    this.inodeSvc.getAllChilds(parentUUID)
      .pipe()
      .subscribe(childs => {
        this.childs = childs.filter(child => {
          return child.isDirectory() || this.data.typeFilter.test(child.type)
        });
      })
  }
}

