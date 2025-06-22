import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { INode } from '../../../mod-files-data/mod-files-data.module';

import { FilesDroppedEvent, INodeDroppedEvent } from '../../directives/drop-target.directive';
import { INodeService } from '../../services/inode.service';
import { UploadService } from '../../services/upload.service';
import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';
import { ContentTypeService } from '../../services/content-type.service';
import { ClipboardService } from '../../services/clipboard.service';
import { SessionService } from '../../../mod-session/session.module';
import { FileDropINodeMenuComponent } from "../files-inode-drop-menu/files-inode-drop-menu.component";
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { Permissions } from '../../models/permissions';
import { Router } from '@angular/router';
import { HashTagConstants, HashTagService } from '../../../mod-hashtags/mod-hashtags.module';
import { MatDialog } from '@angular/material/dialog';
import { FilesPropertiesDialogComponent } from '../files-properties-dialog/files-properties-dialog.component';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';
import { CheckDuplicateEntriesService } from '../../services/check-duplicate-entries.service';

@Component({
  selector: 'app-folder-view',
  templateUrl: './files-folder-view.component.html',
  styleUrls: ['./files-folder-view.component.css'],
  standalone: false
})
export class FilesFolderViewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  public currentFolder: INode = INode.root();
  public inodes: INode[] = new Array<INode>();
  public path: INode[] = new Array<INode>();
  public selectableINodes: Set<INode> = new Set<INode>();
  public selectedINodes: Set<INode> = new Set<INode>();
  public previewINode: INode = INode.empty();

  @ViewChild(FileDropINodeMenuComponent)
  dropInodesMenu: FileDropINodeMenuComponent | undefined;

  @Input()
  set current(inode: INode) {
    this.currentFolder = inode;
    if (!this.currentFolder.isEmpty()) {
      this.refresh();
    }
  }

  @Input()
  viewMode: string = 'grid';

  @Input()
  active: boolean = false;

  @Input()
  iconSize: number = 128;

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  inodesGrabbed: EventEmitter<void> = new EventEmitter<void>();

  showSelectionFrame: boolean = false;
  
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
    private router: Router,
    private inodeSvc: INodeService,
    private uploadSvc: UploadService,
    private commonsDlgSvc: CommonDialogsService,
    private clipboardSvc: ClipboardService,
    private contentTypeSvc: ContentTypeService,
    private hashTagSvc: HashTagService,
    private sessionSvc: SessionService,
    private checkPermsSvc: CheckPermissionsService,
    private checkDuplSvc: CheckDuplicateEntriesService,
    private dialog: MatDialog) {

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
  public refresh() {

    if (!this.currentFolder.isEmpty()) {
      this.reloadEntries();
      this.loadPathInfo();
    }
  }

  /**
   * 
   */
  public reloadEntries() {


    this.inodeSvc.getAllChilds(this.currentFolder.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {

        this.inodes = inodes;
        this.selectableINodes = this.extractSelectableNodes(inodes);
        this.selectedINodes.clear();
        this.previewINode = INode.empty();
      });
  }

  /**
   * Lade den Path für die aktuelle INode
   */
  private loadPathInfo() {

    this.inodeSvc.getPath(this.currentFolder.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(path => {
        this.path = path;
      });
  }

  /**
   * 
   */
  public onGoHome() {
    const uuid = this.sessionSvc.currentUser.userId;
    this.inodeSvc.getINode(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inode => {
        this.onOpen(inode);
      })
  }

  /**
   * 
   * @param contentType 
   */
  public onCreateDocument(desc: CreateMenuEvent) {

    this.commonsDlgSvc.showInputBox('Ein neues Dokument anlegen', 'Name')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(name => {

        if (name) {

          if (desc.ext) {
            name = `${name}.${desc.ext}`;
          }
          this.inodeSvc.createDocument(desc.parent.uuid, name, desc.type)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {

              if (this.currentFolder.uuid === desc.parent.uuid) {
                this.reloadEntries();
              }
            })
        }
      })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about selection                                                     */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * liefere alle selektierbaren Inodes aus der gegebenen Collection
   */
  public extractSelectableNodes(inodes: INode[]): Set<INode> {

    const selectable = new Set<INode>();
    inodes.forEach(inode => {
      if (this.checkPermsSvc.hasPermissions(Permissions.READ, inode)) {
        selectable.add(inode);
      }
    })
    return selectable;
  }

  /**
   * Selektiere alle selektierbaren INodes
   */
  public onSelectAll() {

    const inodes: Set<INode> = new Set<INode>();
    this.selectableINodes.forEach(inode => {
      inodes.add(inode);
    })
    this.selectedINodes = inodes;
  }

  /**
   * Deselektiere alle ausgewählten INodes
   */
  public onDeselectAll() {
    this.selectedINodes = new Set<INode>();
  }
  
  /**
   * 
   */
  public onToggleSelectionFrame() {
    this.showSelectionFrame = !this.showSelectionFrame;
  }

  /**
   * 
   */
  public onSelectionFrameClosed() {
    this.showSelectionFrame = false;    
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about file upload/download                                          */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   * @param fileList 
   */
  onFileUpload(fileList: FileList) {

    const files: File[] = new Array<File>();
    for (let i = 0; i < fileList.length; ++i) {
      files.push(fileList[i]);
    }
    this.uploadFiles(this.currentFolder, files);
  }

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

        if (parent.uuid === this.currentFolder.uuid) {
          this.reloadEntries();
        } // TODO: checkDuplicates
      })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Drop-Operationen von INodes lösen zunächst erst einmal ein ent-         */
  /* sprechendes Event aus. Dies wird innerhalb des HTML-Templates an die    */
  /* show()-Methode einer *FileDropINodeMenuComponent* delegiert.            */
  /*                                                                         */
  /* Diese zeigt darauf hin ein Context-Menu mit den möglichen Operationen   */
  /* (copy, move) an                                                         */
  /*                                                                         */
  /* Und je nach Auswahl wird eine der folgenden Methoden gerufen...         */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Die gedroppte INode soll kopiert werden. Quelle und Target stehen im Event.
   * @param event 
   */
  onCopyDroppedINodes(event: INodeDroppedEvent) {

    this.checkDuplSvc.handleDuplicateINodes(event.target.uuid, [event.source])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {

        this.inodeSvc.copy(inodes, event.target)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.reloadEntries();
          })
      })
  }

  /**
   * Die gedroppte INode soll verschoben werden. Quelle und Target stehen im Event.
   * @param event 
   */
  onMoveDroppedINodes(event: INodeDroppedEvent) {

    this.checkDuplSvc.handleDuplicateINodes(event.target.uuid, [event.source])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {

        this.inodeSvc.move(inodes, event.target)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {

            this.inodesGrabbed.emit();
            this.reloadEntries();
          });
      })
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
      this.commonsDlgSvc.showQueryBox('Bist Du sicher?', msg).subscribe(rsp => {

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

    const inodes = inode ? [inode] : Array.from(this.selectedINodes);
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

    const inodes = inode ? [inode] : Array.from(this.selectedINodes);
    this.clipboardSvc.copy(inodes);
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
            this.clipboardSvc.clear();
          })
        break;

      default:
        break;
    }
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
              this.inodeSvc.update(result.inode) //
                .pipe(takeUntilDestroyed(this.destroyRef)) //
                .subscribe(_ => {

                  this.hashTagSvc.saveHashTags(result.inode.uuid, HashTagConstants.INODE, result.hashTags) //
                    .pipe(takeUntilDestroyed(this.destroyRef)) //
                    .subscribe(_ => {
                      this.refresh();
                    });
                });
            }
          })
      })
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
}
