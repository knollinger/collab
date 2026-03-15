import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, Type, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { FilesDroppedEvent, INodeDroppedEvent } from '../../directives/drop-target.directive';
import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';
import { ContentTypeService } from '../../services/content-type.service';
import { ClipboardService } from '../../services/clipboard.service';
import { HashTagConstants, HashTagService } from '../../../mod-hashtags/mod-hashtags.module';
import { MatDialog } from '@angular/material/dialog';
import { FilesPropertiesDialogComponent } from '../files-properties-dialog/files-properties-dialog.component';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';
import { ACLEntry, CheckPermissionsService, PermissionsService } from '../../../mod-permissions/mod-permissions.module';
import { ThumbnailFactoryService } from '../../services/thumbnail-factory.service';
import { IThumbNail } from '../thumbnails/ithumbnail';
import { DefaultThumbnailComponent } from '../thumbnails/default-thumbnail/default-thumbnail.component';

export class TransferINodeEvent {
  constructor(public readonly target: INode, public readonly src: INode[]) {

  }
}

@Component({
  selector: 'app-folder-view',
  templateUrl: './files-folder-view.component.html',
  styleUrls: ['./files-folder-view.component.css'],
  standalone: false
})
export class FilesFolderViewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  @Input()
  parent: INode = INode.empty()

  private _showHidden: boolean = false;

  @Input()
  public set showHidden(val: boolean) {
    this._showHidden = val;
  }

  public get showHidden(): boolean {
    return this._showHidden;
  }

  @Input()
  childs: INode[] = new Array<INode>();

  /**
   * Liefere die Liste aller anzuzeigenden Childs. Normalerweise werden
   * hidden Nodes ausgeblendet, dies kann aber mittels dem showHidden-
   * Property geändert werden.
   */
  get visibleChilds(): INode[] {

    return this._showHidden ? this.childs : this.childs.filter(inode => {
      return !inode.isHidden();
    })
  }

  @Input()
  selection: Set<INode> = new Set<INode>();

  @Output()
  selectionChanged: EventEmitter<Set<INode>> = new EventEmitter<Set<INode>>();

  @Input()
  viewMode: string = 'grid';

  @Input()
  iconSize: number = 64;

  get iconSizeAsCSS(): string {
    return `${this.iconSize}px`;
  }

  @Input()
  showPreview: boolean = false;

  @Input()
  showSelectors: boolean = true;

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  create: EventEmitter<CreateMenuEvent> = new EventEmitter<CreateMenuEvent>();

  @Output()
  upload: EventEmitter<FilesDroppedEvent> = new EventEmitter<FilesDroppedEvent>();

  @Output()
  copy: EventEmitter<TransferINodeEvent> = new EventEmitter<TransferINodeEvent>();

  @Output()
  move: EventEmitter<TransferINodeEvent> = new EventEmitter<TransferINodeEvent>();

  @Output()
  link: EventEmitter<TransferINodeEvent> = new EventEmitter<TransferINodeEvent>();

  @Output()
  rename: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  delete: EventEmitter<INode[]> = new EventEmitter<INode[]>();

  @Output()
  sendToDashboard: EventEmitter<INode> = new EventEmitter<INode>();


  displayedColumns: string[] = ['selector', 'image', 'name', 'size', 'created', 'modified'];

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
    private commonsDlgSvc: CommonDialogsService,
    private clipboardSvc: ClipboardService,
    private contentTypeSvc: ContentTypeService,
    private hashTagSvc: HashTagService,
    private permsSvc: PermissionsService,
    private checkPermsSvc: CheckPermissionsService,
    private thumbnailSvc: ThumbnailFactoryService,
    private dialog: MatDialog) {

  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about Thumbnails.                                                   */
  /*                                                                         */
  /* Für jedes Element in der Anzeige wird eine Instanz von IThumbnail       */
  /* instanziert. Dies funktioniert via ng-template mit einer                */
  /* ngComponentOutlet-Direktive.                                            */
  /*                                                                         */
  /* Wir brauchen also eine Methode, welche den passenden IThumbNail-        */
  /* Datentyp liefert. Und eine Methode, welche das InputBinding übernimmt.  */
  /*                                                                         */
  /* Das ganze schaut nicht nach "normalem" Angular-Binding aus, geht aber   */
  /* leider nicht anders.                                                    */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  
  /**
   * Der eigentliche Renderer für das ThumbNail wird dynamisch erzeugt. Dazu
   * muss der Typ des Renderers ermittelt werden, dies passiert über den
   * TumbNailFactoryService.
   *  
   * @param inode 
   * @returns 
   */
  getThumbnailClass(inode: INode): Type<IThumbNail> {
    return this.showPreview ? this.thumbnailSvc.getThumbnailFor(inode) : DefaultThumbnailComponent;
  }
  
  /**
   * In jeden ThumbNailRenderer müssen die inode und die IconSize injected 
   * werden. Das Interface für einen Renderer definiert getter+setter für die
   * INode und die IconSize
   * 
   * @param inode 
   * @returns 
   */
  getThumbNailInputs(inode: INode): Record<string, unknown> {

    return {
      inode: inode,
      iconSize: this.iconSizeAsCSS
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about special INode states                                          */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Liefere das Overlay-Ocon für einen Link
   */
  public get linkIcon(): string {
    return this.contentTypeSvc.getTypeIconUrl('inode/link');
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  public isLocked(inode: INode): boolean {
    return !this.checkPermsSvc.hasPermissions(inode.acl, ACLEntry.PERM_READ);
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  getINodeImage(inode: INode): string {
    return this.contentTypeSvc.getTypeIconUrl(inode.type);
  }

  /**
   * 
   * @param inode 
   * @returns 
  */
  getINodeImageAsUrl(inode: INode): string {
    return `url('${this.contentTypeSvc.getTypeIconUrl(inode.type)}')`;
  }

  /**
   * 
   * @param contentType 
   */
  public onCreateDocument(evt: CreateMenuEvent) {

    this.create.next(evt);
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about selection                                                     */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   * @param inode 
   * @returns 
   */
  public isSelected(inode: INode): boolean {

    return this.selection.has(inode);
  }

  /** 
   * 
   */
  public onSelect(evt: MouseEvent, inode: INode) {

    evt.stopPropagation();

    if (this.selection.has(inode)) {
      this.selection.delete(inode);
    }
    else {
      this.selection.add(inode);
    }

    this.selectionChanged.emit(this.selection);
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about file upload/download                                          */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  onFileDownload() {
    alert('not yet implemented');
  }

  /**
   * Ein FileDrop wurde ausgelöst. Entweder auf dem Folder
   * selbst oder auf einem seiner Childs. Lade die Files
   * hoch
   * 
   */
  onFilesDropped(event: FilesDroppedEvent) {

    this.upload.next(event);
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Drop-Operationen von INodes lösen zunächst erst einmal ein ent-         */
  /* sprechendes Event aus. Dies wird innerhalb des HTML-Templates an die    */
  /* show()-Methode einer *FileDropINodeMenuComponent* delegiert.            */
  /*                                                                         */
  /* Diese zeigt darauf hin ein Context-Menu mit den möglichen Operationen   */
  /* (copy, move, link, cancel) an                                           */
  /*                                                                         */
  /* Und je nach Auswahl wird eine der folgenden Methoden gerufen...         */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Die gedroppte INode soll kopiert werden. Quelle und Target stehen im Event.
   * @param event 
   */
  onCopyDroppedINodes(event: INodeDroppedEvent) {

    this.copy.next(new TransferINodeEvent(event.target, event.sources));
  }

  /**
   * Die gedroppte INode soll verschoben werden. Quelle und Target stehen im Event.
   * @param event 
   */
  onMoveDroppedINodes(event: INodeDroppedEvent) {

    this.move.next(new TransferINodeEvent(event.target, event.sources));
  }

  /**
   * Für die gedroppte INode soll im target ein Link erstellt werden
   * 
   * @param event 
   */
  onLinkDroppedINodes(event: INodeDroppedEvent) {

    this.link.next(new TransferINodeEvent(event.target, event.sources));
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Klassische INode-Ops                                                    */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Ein Open-Request wurde auf einem Item ausgelöst. Wenn es sich um eine
   * Directory-Inode handelt, so wird dorthin navigiert. Die Navigation übernimmt
   * der Parent.
   * 
   * Anderenfalls wird geprüft, ob es sich um ein OfficeDoc handelt. In diesem
   * Fall wird der Collabra-Editor in einem neuen Tab gestartet. Wenn das nicht
   * def Fall ist, wird die Preview-Component anktiviert.
   * 
   * 
   * @param inode 
   */
  onOpen(inode: INode) {

    this.open.emit(inode);
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

    this.commonsDlgSvc.showInputBox('Umbenennen', 'Neuer Datei-Name', inode.name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newName => {

        if (newName) {

          const newNode = new INode(newName, inode.uuid, inode.parent, inode.linkTo, inode.type, inode.size, inode.created, inode.modified, inode.acl);
          this.rename.next(newNode);
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

    const toDelete = inode ? Array.of(inode) : Array.from(this.selection);
    this.delete.next(toDelete);
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

    const inodes = inode ? [inode] : Array.from(this.selection);
    this.clipboardSvc.cut(inodes);
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

    const inodes = inode ? [inode] : Array.from(this.selection);
    this.clipboardSvc.copy(inodes);
  }

  /**
   * Eine LINK-Operation wurde angeforder. Entweder ist diese via ContextMenu
   * auf einer INode passiert oder aus der Toolbar.
   * 
   * Aus diesem Grund ist das INode-Argument auch optional. Beim Copy via
   * ContextMenu ist die INode bekannt. Beim Copy aus der Toolbar sollen
   * alle selektierten INodes kopiert werden. Das Argument ist dann
   * undefined. 
   *  
   * @param inode 
   */
  onLink(inode?: INode) {

    const inodes = inode ? [inode] : Array.from(this.selection);
    this.clipboardSvc.link(inodes);
  }

  /**
   * Auf dem aktuellen Folder wurde eine Paste-Operation angefordert.
   * 
   * Je nach angeforderter OP werden unterschiedliche Services gerufen.
   * 
   */
  onPaste(target: INode) {

    console.log(`paste to: ` + target);
    switch (this.clipboardSvc.operation) {
      case ClipboardService.OP_COPY:
        this.copy.next(new TransferINodeEvent(target, this.clipboardSvc.inodes));
        break;

      case ClipboardService.OP_MOVE:
        this.move.next(new TransferINodeEvent(target, this.clipboardSvc.inodes));
        this.clipboardSvc.clear();
        break;


      case ClipboardService.OP_LINK:
        this.link.next(new TransferINodeEvent(target, this.clipboardSvc.inodes));
        this.clipboardSvc.clear();
        break;

      default:
        break;
    }
  }

  /**
   * 
   * @param inode 
   */
  onSendToDashboard(inode: INode) {
    this.sendToDashboard.next(inode);
  }

  /**
   * An einer INode wurde ein showProps() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onShowProps(inode: INode) {

    this.hashTagSvc.getHashTagsByResourceId(inode.uuid) //
      .pipe(takeUntilDestroyed(this.destroyRef)) //
      .subscribe(tags => {

        const dlgRef = this.dialog.open(FilesPropertiesDialogComponent, {
          width: '600px',
          data: {
            inode: inode,
            hashTags: tags
          },
        });

        dlgRef.afterClosed() //
          .pipe(takeUntilDestroyed(this.destroyRef)) //
          .subscribe(result => {

            if (result) {

              console.log('update ACL');
              this.permsSvc.updateACL(result.inode.uuid, result.inode.acl) //
                .pipe(takeUntilDestroyed(this.destroyRef)) //
                .subscribe(_ => {

                  this.hashTagSvc.saveHashTags(result.inode.uuid, HashTagConstants.INODE, result.hashTags) //
                    .pipe(takeUntilDestroyed(this.destroyRef)) //
                    .subscribe(_ => {
                      // this.refresh();
                    });
                });
            }
          })
      })
  }
}
