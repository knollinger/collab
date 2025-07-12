import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeService } from '../../services/inode.service';
import { SessionService } from '../../../mod-session/session.module';

export interface IFilePickerData {
  multiple: boolean,
  current: INode
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
  viewMode: string = 'list';
  selected: Set<INode> = new Set<INode>();

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
  }

  /**
   * 
   * @param inode 
   */
  onOpen(inode: INode) {

    if (inode.isDirectory()) {
      this.currentFolder = inode;
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
}

