import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { INode } from '../../models/inode';
import { Permissions } from '../../models/permissions';
import { ClipboardService } from '../../services/clipboard.service';
import { CreateMenuService } from '../../services/create-menu.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateMenuItemDesc, CreateMenuItemGroup } from '../../models/create-menu-item';

/**
 * Die Toolbar für den FolderView.
 * 
 * Im wesentlichen dient die Component nur der Anzeige der Toolbar-Options
 * sowie der Steuerung deren enabled/disabled-States. Die Aktivierung
 * dieser Optionen wird durch Events an den Parent gemeldet.
 * 
 * Ausnahme sind hier CUT und COPY, diese Aktionen können problemlos
 * innerhalb dieser Component verarbeitet werden.
 * 
 */
@Component({
  selector: 'app-files-folderview-toolbar',
  templateUrl: './files-folderview-toolbar.component.html',
  styleUrls: ['./files-folderview-toolbar.component.css']
})
export class FilesFolderviewToolbarComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  
  @Input()
  currentFolder: INode = INode.empty();

  @Input()
  selectedINodes: Set<INode> = new Set<INode>();

  @Input()
  selectableINodes: Set<INode> = new Set<INode>();

  @Output()
  goHome: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  reload: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  createDocument: EventEmitter<CreateMenuItemDesc> = new EventEmitter<CreateMenuItemDesc>();

  @Output()
  selectAll: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  deselectAll: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  paste: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  uploadFiles: EventEmitter<FileList> = new EventEmitter<FileList>();

  @Output()
  cloudDownload: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  delete: EventEmitter<void> = new EventEmitter<void>();

  createGroups: CreateMenuItemGroup[] = new Array<CreateMenuItemGroup>();

  /**
   * 
   * @param checkPermsSvc 
   */
  constructor(
    private clipBoardSvc: ClipboardService,
    private checkPermsSvc: CheckPermissionsService,
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
   */
  onGoHome() {
    this.goHome.emit();
  }

  /**
   * 
   */
  onReload() {
    this.reload.emit();
  }

  /**
   * 
   */
   onCreateDocument(desc: CreateMenuItemDesc) {
    this.createDocument.emit(desc);
  }

  /**
   * 
   */
  onSelectAll() {
    this.selectAll.emit();
  }

  /**
   * 
   */
  onDeselectAll() {
    this.deselectAll.emit();
  }

  /**
   * 
   */
  onCut() {
    this.clipBoardSvc.cut(this.selectedINodesAsArray);
  }

  /**
   * 
   */
  onCopy() {
    this.clipBoardSvc.cut(this.selectedINodesAsArray);
  }

  /**
   * 
   */
  onPaste() {
    this.paste.emit();
  }

  /**
   * 
   */
  onClearClipboard() {
    this.clipBoardSvc.clear();
  }

  /**
   * Hilfsmethode um aus dem Set<INode> ein Array
   * zu machen.
   */
  private get selectedINodesAsArray(): INode[] {

    const inodes: INode[] = new Array<INode>();
    this.selectedINodes.forEach(inode => {
      inodes.push(inode);
    });
    return inodes;
  }

  /**
   * 
   * @param evt 
   */
  onFileUpload(evt: Event) {

    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length) {
      this.uploadFiles.emit(files);
    }
  }

  /**
   * 
   */
  onCloudDownload() {
    this.cloudDownload.emit();
  }

  /**
   * 
   */
  onDelete() {
    this.delete.emit();
  }

  /**
   * 
   */
  get isWriteable(): boolean {
    return this.checkPermsSvc.hasPermissions(Permissions.WRITE, this.currentFolder);
  }


  /**
   * Ist Paste erlaubt?
   */
  get isPasteEnabled(): boolean {

    return this.isWriteable && this.clipBoardSvc.inodes.length > 0;
  }

  /**
   * Liefere die Anzahl von Pasteable INodes
   */
  get nrOfPasteables(): number {
    return this.clipBoardSvc.inodes.length;
  }

  /** 
   * 
   */
  get hasSelection(): boolean {
    return this.selectedINodes.size > 0;
  }

  /**
   * 
   */
  get showSelectAll(): boolean {
    return this.selectableINodes.size !== this.selectedINodes.size;
  }
}
