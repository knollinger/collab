import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';

/**
 * Die *FilesBreadCrumbItemComponent* stellt einen Verzeichnis-Eintrag
 * als BreadCrumb dar. 
 * 
 * Dazu gehört ein mat-icon mit einem Folder-Symbol und ein Text mit dem
 * FolderNamen.
 * 
 * Beim Klick auf das Folder-Symbol wird ein Menu mit allen Folder-Childs
 * des aktuellen Eintrags geöffnet. EIn Klick auf solch einen Eintrag 
 * propagiert ein open()-Event auf den entsprechenden ChildFolder.
 * 
 * Ein Klick auf den Text propagiert eine open-Event auf den durch die 
 * Breadcrumb representierten Folder.
 */
@Component({
  selector: 'app-files-bread-crumb-item',
  templateUrl: './files-bread-crumb-item.component.html',
  styleUrls: ['./files-bread-crumb-item.component.css']
})
export class FilesBreadCrumbItemComponent implements OnInit {

  @Input()
  inode: INode = INode.empty();

  /**
   * Das Event wird ausgelöst, sobald entweder auf den Text der BreadCrumb 
   * geklickt wurde (mit der aktuellen INode als Payload) oder auf einen
   * ChildFolder aus dem Menu der Childs (mit dem selektierten ChildFolder)
   */
  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();
  
  childs: INode[] = new Array<INode>();

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private inodeSvc: INodeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.inodeSvc.getAllChilds(this.inode.uuid, true).subscribe(childs => {
      this.childs = childs;
    })
  }

  /**
   * 
   * @param inode 
   */
  onOpen(inode: INode) {
    this.open.emit(inode);
  }
}
