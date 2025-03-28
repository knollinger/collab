import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { INode } from '../../models/inode';
import { FilesDroppedEvent, INodeDroppedEvent } from '../../directives/drop-target.directive';
import { INodeService } from '../../services/inode.service';
import { UploadService } from '../../services/upload.service';
import { InputBoxService, MessageBoxService } from '../../../mod-commons/mod-commons.module';
import { ContentTypeService } from '../../services/content-type.service';
import { ShowDuplicateFilesService } from '../../services/show-duplicate-files.service';
import { FilesPropertiesService } from '../../services/files-properties.service';
import { ClipboardService } from '../../services/clipboard.service';
import { SessionService } from '../../../mod-session/session.module';
import { FileDropINodeMenuComponent } from "../files-inode-drop-menu/files-inode-drop-menu.component";
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { Permissions } from '../../models/permissions';

@Component({
  selector: 'app-folder-view',
  templateUrl: './files-folder-view.component.html',
  styleUrls: ['./files-folder-view.component.css'],
})
export class FilesFolderViewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  public currentFolder: INode = INode.root();
  public inodes: INode[] = new Array<INode>();
  public path: INode[] = new Array<INode>();
  public selectedINodes: Set<INode> = new Set<INode>();
  public previewINode: INode = INode.empty();

  @ViewChild(FileDropINodeMenuComponent)
  dropInodesMenu: FileDropINodeMenuComponent | undefined;

  @Input()
  set current(inode: INode) {
    this.currentFolder = inode;
    this.refresh();
  }

  @Input()
  viewMode: string = 'grid';

  @Input()
  active: boolean = false;

  @Input()
  iconSize: number = 128;

  @Output()
  activated: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  inodesGrabbed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * 
   * @param inodeSvc 
   * @param uploadSvc 
   * @param messageBoxSvc 
   * @param inputBoxSvc 
   * @param contentTypeSvc 
   * @param propsSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private uploadSvc: UploadService,
    private messageBoxSvc: MessageBoxService,
    private inputBoxSvc: InputBoxService,
    private clipboardSvc: ClipboardService,
    private contentTypeSvc: ContentTypeService,
    private showDuplFilesSvc: ShowDuplicateFilesService,
    private propsSvc: FilesPropertiesService,
    private sessionSvc: SessionService,
    private checkPermsSvc: CheckPermissionsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.refresh();
  }

  /**
   * 
   */
  private refresh() {

    this.reloadEntries();
    this.loadPathInfo();
  }

  /**
   * 
   */
  public reloadEntries() {

    this.inodeSvc.getAllChilds(this.currentFolder.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {

        this.inodes = inodes;
        this.selectedINodes.clear();
        this.previewINode = INode.empty();
      });
  }

  /**
   * 
   */
  public onActivateView() {
    this.activated.emit(this.currentFolder);
  }

  /**
   * 
   */
  public onGoHome() {
    const uuid = this.sessionSvc.currentUser.userId;
    this.inodeSvc.getINode(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inode => {
        this.currentFolder = inode;
        this.refresh();
      })
  }

  get isWriteable(): boolean {
    return this.checkPermsSvc.hasPermissions(Permissions.WRITE, this.currentFolder);
  }

  /**
   * 
   */
  public onCreateFolder() {

    this.inputBoxSvc.showInputBox('Einen neuen Ordner anlegen', 'Name')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(name => {

        this.inodeSvc.createFolder(this.currentFolder.uuid, name).subscribe(() => {
          this.reloadEntries();
        })
      })
  }

  /**
   * 
   */
  private loadPathInfo() {

    this.inodeSvc.getPath(this.currentFolder.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(path => {
        this.path = path;
      });
  }

  public get showSelectAll(): boolean {

    return this.inodes.length !== this.selectedINodes.size;
  }

  public get hasSelection(): boolean {
    return this.selectedINodes.size !== 0;
  }

  /**
   * 
   */
  public onSelectAll() {

    const inodes: Set<INode> = new Set<INode>();
    this.inodes.forEach(inode => {
      inodes.add(inode);
    })
    this.selectedINodes = inodes;
  }

  public onDeselectAll() {
    this.selectedINodes = new Set<INode>();
  }

  onFileUpload(evt: Event) {

    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length) {

      const files: File[] = new Array<File>();
      for (let i = 0; i < input.files.length; ++i) {
        files.push(input.files[i]);
      }
      this.uploadFiles(this.currentFolder, files);
    }
  }


  /**
   * Auf eines der GridView-Items wurde ein FileDrop durchgeführt.
   * Das behandeln wir hier nicht sondern geben das einfach an den
   * Parent weiter.
   * 
   */
  onFilesDropped(event: FilesDroppedEvent) {

    this.uploadFiles(event.target, event.files);
  }

  /**
   * 
   * @param parent 
   * @param files 
   */
  private uploadFiles(parent: INode, files: File[]) {

    this.uploadSvc.uploadFiles(parent.uuid, files)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {

        if (rsp.duplicateFiles.length) {

          this.showDuplFilesSvc.show(rsp.duplicateFiles)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(action => {
              alert(`Action: ${action}`);
            })
        }
        else {
          if (parent.uuid === this.currentFolder.uuid) {
            this.reloadEntries();
          }
        }
      })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Drop-Operationen von INodes lösen zunächst erst einmal ein ent-         */
  /* sprechendesEvent aus. Dies wird innerhalb des HTML-Templates an die     */
  /* show()-Methode einer *FileDropINodeMenuComponent* delegiert.            */
  /*                                                                         */
  /* Diese zeigt darauf hin ein Context-Menu mit den möglichen Operationen   */
  /* (copy, move, link) an                                                   */
  /*                                                                         */
  /* Und je nach Auswahl wird eine der folgenden Methoden gerufen...         */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Die gedroppte INode soll kopiert werden. Quelle und Target stehen im Event.
   * @param event 
   */
  onCopyDroppedINodes(event: INodeDroppedEvent) {
    this.inodeSvc.copy(event.source, event.target)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.reloadEntries();
      })
  }

  /**
   * Die gedroppte INode soll verschoben werden. Quelle und Target stehen im Event.
   * @param event 
   */
  onMoveDroppedINodes(event: INodeDroppedEvent) {

    this.inodeSvc.move(event.source, event.target)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.inodesGrabbed.emit();
        this.reloadEntries();
      })
  }

  /**
   * Für die gedroppte INode soll ein symbolischer Link erstellt werden. 
   * Quelle und Target stehen im Event.
   * 
   * @param event 
   */
  onLinkDroppedINodes(event: INodeDroppedEvent) {

  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Klassische INode-Ops                                                    */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Ein Open-Request wurde auf einem Item ausgelöst. Wenn es sich um eine
   * Directory-Inode handelt, so wird dorthin navigiert.
   * 
   * Anderenfalls wird ein preview()-Event ausgelöst- Soll sich doch der 
   * Parent drum kümmern ob, wo und wie er die Datei-Vorschau anzeigt.
   * 
   * @param inode 
   */
  onOpen(inode: INode) {

    if (inode.isDirectory()) {
      this.currentFolder = inode;
      this.refresh();
    }
    else {
      this.previewINode = inode;
    }
  }

  /**
   * 
   */
  onClosePreview() {
    this.previewINode = INode.empty();
  }

  /**
   * An einer INode wurde ein rename() angefordert. Wir fragen nach 
   * dem neuen Namen und lösen den Rename aus.
   * 
   * Wenn selbiges Erfolg hatte, wird die View aktualisiert.
   * 
   * @param inode 
   */
  onRename(inode: INode) {

    this.inputBoxSvc.showInputBox('Umbenennen', 'Neuer Datei-Name', inode.name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newName => {

        if (newName) {

          this.inodeSvc.rename(inode.uuid, newName).subscribe(() => {
            this.reloadEntries();
          });
        }
      });
  }

  /**
   * An einer INode wurde ein delete() angefordert. 
   * 
   * Wir zeigen den üblichen "Bist Du sicher?" Dialog an und löschen dann 
   * die INode.
   * 
   * Wenn selbiges Erfolg hatte, wird die View aktualisiert.
   * 
   * @param inode 
   */
  onDelete(inode?: INode) {

    const toDelete = inode ? Array.of(inode) : Array.from(this.selectedINodes);
    if (toDelete.length) {

      const uuids = new Array<string>();
      let msg = '<p>Möchtest Du folgende Objekte wirklich löschen?</p>'
      toDelete.forEach(node => {
        msg += `<div class=\"disp-flex flex-row flex-alignitems-center\">`;
        msg += `<img class=\"flex-0 small-right-spacer\" src=\"${this.contentTypeSvc.getTypeIconUrl(node.type)}\" width="32px">`;
        msg += `<span class=\"flex-1\">${node.name}</span>`;
        msg += `</div>`;
        uuids.push(node.uuid);
      })
      msg += '<p class=\"small-top-spacer\">Diese Operation kann nicht rückgängig gemacht werden!</p>';
      this.messageBoxSvc.showQueryBox('Bist Du sicher?', msg).subscribe(rsp => {

        if (rsp) {
          this.inodeSvc.delete(uuids)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.reloadEntries();
            })
        }
      })
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Clipboard-Ops                                                           */
  /*                                                                         */
  /* Wir verwenden hier nicht das native Clipboard, sondern den eigenen      */
  /* *ClipboardService*.                                                     */
  /*                                                                         */
  /* Grund dafür ist, das die "normale" Clipbord-Integration in HTML5 dummer-*/
  /* weise stark limitiert ist (content-Types und co). Es würde also nur die */
  /* JSON.serialisierung der INodes + der gewünschten Operation bleiben, das */
  /* dann als text/plain ins native clipboard.                               */
  /*                                                                         */
  /* Dadurch würden aber u.a die UUIDs der INodes im nativen Clipboard       */
  /* landen. Und das möchste ich gerne vermeiden.                            */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * ist das Clipboard leer? Wird benötigt um die disabled-states in der 
   * Toolbar zu steuern
   */
  public get isClipbordEmpty(): boolean {
    return this.clipboardSvc.isEmpty;
  }

  /**
   * Eine CUT-Operation wurde angeforder. Entweder ist diese via ContextMenu
   * auf einer INode passiert oder aus der Toolbar.
   * 
   * Aus diesem Grund ist das INode-Argument auch optional. Beim Cut via
   * ContextMenu ist die INode bekannt. Beim Cut aus der Toolbar sollen
   * alle selektierten INodes ge-cutted werden. Das Argument ist dann
   * undefined. 
   *  
   * @param inode 
   */
  onCut(inode?: INode) {

    this.clipboardSvc.cut(inode || this.selectedINodesAsArray);
  }

  /**
   * Eine COPY-Operation wurde angeforder. Entweder ist diese via ContextMenu
   * auf einer INode passiert oder aus der Toolbar.
   * 
   * Aus diesem Grund ist das INode-Argument auch optional. Beim Copy via
   * ContextMenu ist die INode bekannt. Beim Copy aus der Toolbar sollen
   * alle selektierten INodes kopiert werden. Das Argument ist dann
   * undefined. 
   *  
   * @param inode 
   */
  onCopy(inode?: INode) {

    this.clipboardSvc.copy(inode || this.selectedINodesAsArray);
  }

  /**
   * Auf dem aktuellen Folder wurde eine Paste-Operation angefordert.
   * 
   * Je nach angeforderter OP werden unterschiedliche Services gerufen.
   * 
   */
  onPaste() {

    switch (this.clipboardSvc.operation) {
      case ClipboardService.OP_COPY:
        this.inodeSvc.copy(this.clipboardSvc.inodes, this.currentFolder)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.reloadEntries();
          })
        break;

      case ClipboardService.OP_MOVE:
        this.inodeSvc.move(this.clipboardSvc.inodes, this.currentFolder)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.inodesGrabbed.emit();
            this.reloadEntries();
          })
        break;

      default:
        break;
    }
  }

  /**
   * An einem GridViewItem wurde ein showProps() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onShowProps(inode: INode) {
    this.propsSvc.showPropDialog(inode) //
      .pipe(takeUntilDestroyed(this.destroyRef)) //
      .subscribe(result => {

        if (result) {
          this.refresh();
        }
      });
  }

  /**
   * Liefere die Gesamt-Grö0e aller INodes.
   */
  public get allObjectsSize(): number {

    return this.calcObjsSize(this.inodes);
  }

  /**
   * Liefere die Gesamt-Grö0e aller selektierten INodes.
   */
  public get selectedObjectSize(): number {

    return this.calcObjsSize(this.selectedINodes);
  }

  /**
   * Berechne die GesamtGröße aller INodes im angegebenen
   * Iterable (Array, Set, ...)
   * 
   * Das ganze läuft nicht rekursiv, der Inhalt von 
   * Verzeichnissen wird also **nicht** mit berechnet!

   * @param container 
   * @returns 
   */
  private calcObjsSize(container: Iterable<INode>) {

    let result = 0;

    for (let inode of container) {
      result += inode.size;
    }
    return result;
  }

  /**
   * Liefere das Set der selektierten INodes als Array
   */
  private get selectedINodesAsArray(): INode[] {

    const inodes: INode[] = new Array<INode>();
    this.selectedINodes.forEach(inode => {
      inodes.push(inode);
    });
    return inodes;
  }
}
