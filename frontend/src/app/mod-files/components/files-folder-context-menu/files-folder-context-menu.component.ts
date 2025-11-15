import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { ClipboardService } from '../../services/clipboard.service';
import { CreateMenuEvent } from '../../components/files-create-menu/files-create-menu.component';
import { ACLEntry, CheckPermissionsService } from '../../../mod-permissions/mod-permissions.module';

@Component({
  selector: 'app-files-folder-context-menu',
  templateUrl: './files-folder-context-menu.component.html',
  styleUrls: ['./files-folder-context-menu.component.css'],
  standalone: false
})
export class FilesFolderContextMenuComponent implements OnInit {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Input()
  inode: INode = INode.empty();

  @Output()
  createDocument: EventEmitter<CreateMenuEvent> = new EventEmitter<CreateMenuEvent>();
  
  @Output()
  paste: EventEmitter<void> = new EventEmitter();

  @Output()
  download: EventEmitter<INode> = new EventEmitter();

  @Output()
  showProps: EventEmitter<INode> = new EventEmitter();

  triggerPosX: string = '';
  triggerPosY: string = '';

  /**
   * 
   */
  constructor(
    private checkPermsSvc: CheckPermissionsService,
    private clipboardSvc: ClipboardService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /**
   * 
   * @param evt 
   */
  show(evt: MouseEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.trigger) {

      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;

      this.trigger.openMenu();
    }
  }

  /**
   * Soll die Paste-Option angezeigt werden?  
  */
  get isShowPasteEntry(): boolean {
    return this.isWriteAllowed && !this.clipboardSvc.isEmpty;
  }

  /**
   * liefere die Anzahl von pastable Elementen  
  */
  get nrPasteElements(): number {
    return this.clipboardSvc.inodes.length
  }

  /**
   * 
   */
  onCreateDocument(desc: CreateMenuEvent) {
    this.createDocument.emit(desc);
  }

  /**
   * Propagiere ein Paste-Event
   */
  onPaste() {
    this.paste.emit();
  }

  /**
   * 
   */
  onDownload() {
    this.download.emit(this.inode);
  }

  /**
   * 
   */
  onShowProperties() {
    this.showProps.emit(this.inode);
  }

  /**
   * 
   */
  get isReadAllowed(): boolean {

    return this.checkPermsSvc.hasPermissions(this.inode.acl, ACLEntry.PERM_READ);
  }

  /**
   * 
   */
  get isWriteAllowed(): boolean {

    return this.checkPermsSvc.hasPermissions(this.inode.acl, ACLEntry.PERM_WRITE);
  }
}
