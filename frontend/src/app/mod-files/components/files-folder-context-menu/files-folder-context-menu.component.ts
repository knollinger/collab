import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { INode } from '../../models/inode';
import { ClipboardService } from '../../services/clipboard.service';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { Permissions } from '../../models/permissions';
import { CreateMenuService } from '../../services/create-menu.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateMenuItemDesc, CreateMenuItemGroup } from '../../models/create-menu-item';

@Component({
  selector: 'app-files-folder-context-menu',
  templateUrl: './files-folder-context-menu.component.html',
  styleUrls: ['./files-folder-context-menu.component.css']
})
export class FilesFolderContextMenuComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Input()
  inode: INode = INode.empty();

  @Output()
  createFolder: EventEmitter<void> = new EventEmitter();

  @Output()
  createDocument: EventEmitter<CreateMenuItemDesc> = new EventEmitter<CreateMenuItemDesc>();
  
  @Output()
  paste: EventEmitter<void> = new EventEmitter();

  @Output()
  download: EventEmitter<INode> = new EventEmitter();

  @Output()
  showProps: EventEmitter<INode> = new EventEmitter();

  triggerPosX: string = '';
  triggerPosY: string = '';
  createGroups: CreateMenuItemGroup[] = new Array<CreateMenuItemGroup>();

  /**
   * 
   */
  constructor(
    private checkPermsSvc: CheckPermissionsService,
    private clipboardSvc: ClipboardService,
    private createMenuSvc: CreateMenuService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.createMenuSvc.getMenuGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {
        this.createGroups = groups;
      })
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
  onCreateFolder() {
    this.createFolder.emit();
  }
  
  /**
   * 
   */
  onCreateDocument(desc: CreateMenuItemDesc) {
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

    return this.checkPermsSvc.hasPermissions(Permissions.READ, this.inode);
  }

  /**
   * 
   */
  get isWriteAllowed(): boolean {

    return this.checkPermsSvc.hasPermissions(Permissions.WRITE, this.inode);
  }
}
