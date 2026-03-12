import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonDialogsService, TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';
import { SettingsService } from '../../../mod-settings/mod-settings.module';
import { UploadService } from '../../services/upload.service';
import { INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeService } from '../../services/inode.service';
import { ClipboardService } from '../../services/clipboard.service';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';
import { CheckDuplicateEntriesService } from '../../services/check-duplicate-entries.service';
import { ContentTypeService } from '../../services/content-type.service';
import { FilesDroppedEvent } from '../../directives/drop-target.directive';
import { OpenInodeService } from '../../services/open-inode.service';

export class IconSize {

  constructor(
    public readonly size: string,
    public readonly text: string) {

  }
}

/**
 * Die Haupt-Component der Files-Ansicht
 */
@Component({
  selector: 'app-files-main-view',
  templateUrl: './files-main-view.component.html',
  styleUrls: ['./files-main-view.component.css'],
  standalone: false
})

export class FilesMainViewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  showHiddenFiles: boolean = false;
  private settings: any = {}

  public parent: INode = INode.empty();
  public path: INode[] = Array<INode>();
  public childs: INode[] = Array<INode>();
  public selected: Set<INode> = new Set<INode>();

  iconSizes: IconSize[] = [
    new IconSize('64px', "Klein"),
    new IconSize('96px', "Mittel"),
    new IconSize('128px', "Groß"),
    new IconSize('160px', "Sehr groß")
  ]

  /**
   * 
   * @param route 
   * @param router 
   * @param titlebarSvc 
   * @param inodeSvc 
   * @param clipboardSvc 
   * @param sessionSvc 
   * @param settingsSvc 
   */
  constructor(
    private router: Router,
    private currRoute: ActivatedRoute,
    private commonsDlgSvc: CommonDialogsService,
    private titlebarSvc: TitlebarService,
    private inodeSvc: INodeService,
    private clipboardSvc: ClipboardService,
    private sessionSvc: SessionService,
    private settingsSvc: SettingsService,
    private checkDuplicatesSvc: CheckDuplicateEntriesService,
    private contentTypeSvc: ContentTypeService,
    private uploadSvc: UploadService,
    private openSvc: OpenInodeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'Dateien';
    this.loadSettings();

    this.currRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const target = params.get('uuid');
        if (!target) {
          this.onGoHome();
        } else {
          this.inodeSvc.getINode(target)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(inode => {
              this.parent = inode;
              this.onRefresh();
            })
        }
      })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the statusbar                                                 */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  get nrOfChilds(): number {
    return this.childs.length;
  }

  /**
   * 
   */
  get totalChildSize(): number {

    let result = 0;
    this.childs.forEach(child => {
      result += child.size;
    })
    return result;
  }

  /**
   * 
   */
  get selectedChildSize(): number {

    let result = 0;
    this.selected.forEach(child => {
      result += child.size;
    })
    return result;
  }

  /**
   * Liefere die Anzahl von Selektierten INodes
   */
  get nrOfSelectedChilds(): number {

    return this.selected.size;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the settings                                                  */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Lade die Settings
   */
  private loadSettings() {

    this.settingsSvc.getDomainSettings('files')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(settings => {
        this.settings = settings;

      })
  }

  /**
   * 
   */
  get viewMode(): string {

    return this.settings['viewMode'] || 'grid';
  }

  /**
   * 
   */
  set viewMode(mode: string) {

    if (mode && mode !== this.settings['viewMode']) {
      this.settings['viewMode'] = mode;
      this.settingsSvc.setDomainSettings('files', this.settings);
    }
  }

  /**
   * 
   */
  get iconSize(): string {

    return this.settings['iconSize'] || '128px';
  }

  /**
   * 
   */
  set iconSize(size: string) {

    if (size !== this.settings['iconSize']) {
      this.settings['iconSize'] = size;
      this.settingsSvc.setDomainSettings('files', this.settings);
    }
  }

  /**
   * 
   */
  get showPreview(): boolean {

    return this.settings['showPreview'] || false;
  }

  /**
   * 
   */
  set showPreview(val: boolean) {

    if (val !== this.settings['showPreview']) {
      this.settings['showPreview'] = val;
      this.settingsSvc.setDomainSettings('files', this.settings);
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the toolbar                                                   */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Callback für den GoHome-Button. Der Pfad des aktiven Tabs wird auf das
   * HomeDir des aktuellen Benutzers gesetzt.
   * 
   */
  onGoHome() {

    const homeDirId = this.sessionSvc.currentUser.userId;
    const url = `files/main/${homeDirId}`;
    this.router.navigateByUrl(url);
  }

  /**
   * Den aktuellen Folder neu laden
   */
  onRefresh() {

    this.inodeSvc.getAllChilds(this.parent.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(childs => {

        this.childs = childs;
        this.selected = new Set<INode>();
        this.inodeSvc.getPath(this.parent.uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(path => {
            this.path = path;
          })
      })
  }

  /**
   * ist in im aktuellen Tab wenigstens eine INode selektiert?
   */
  get hasSelection(): boolean {
    return this.nrOfSelectedChilds > 0;
  }

  /**
   * Wähle in der aktuellen SubPane alle INodes aus
   */
  onSelectAll() {

    const selected = new Set<INode>(this.childs.filter(child => {

      let result = this.showHiddenFiles;
      if (!result) {
        result = !child.isHidden();
      }
      return result;
    }));

    this.selected = selected;
  }

  /**
   * hebe die Auswahl in der aktuellen SubPane auf
   */
  onDeselectAll() {
    this.selected.clear();
  }

  /**
   * 
   * @param tabIdx 
   * @param selections 
   */
  onSelectionChange(selections: Set<INode>) {

    this.selected = selections;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about clipbord actions                                              */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Schneide alle selektierten INodes aus und verfrachte sie in das App-Clipboard
   */
  onCut() {

    const toCut = new Array<INode>(...this.selected);
    this.clipboardSvc.cut(toCut);
  }

  /**
   * Kopiere alle selektierten INodes in das App-Clipboard
   */
  onCopy() {
    const toCopy = new Array<INode>(...this.selected);
    this.clipboardSvc.copy(toCopy);
  }

  /**
   * Kopiere Links auf alle selektierten INodes in das App-Clipboard
   */
  onLink() {
    const toLink = new Array<INode>(...this.selected);
    this.clipboardSvc.link(toLink);
  }

  /**
   * Verarbeit eine Paste-OP. Im Application-Clipboard stehen eine Liste
   * von INodes und eine Operation. Diese kann folgende Werte annehmen:
   * 
   * * OP_COPY Die Inodes werden in den ParentFolder des aktuellen Tabs kopiert.
   * * OP_MOVE Die INodes werden in den ParentFolder des aktuellen Tabs verschoben
   * * OP_LINK Im ParentFolder des aktuellen Tabs werden Links auf die INodes angelegt.
   */
  onPaste() {

    const newParent = this.parent;

    switch (this.clipboardSvc.operation) {
      case ClipboardService.OP_COPY:
        this.copyINodes(newParent, this.clipboardSvc.inodes);
        break;

      case ClipboardService.OP_MOVE:
        this.moveINodes(newParent, this.clipboardSvc.inodes);
        break;

      case ClipboardService.OP_LINK:
        this.linkINodes(newParent, this.clipboardSvc.inodes);
        break;

      default:
        break;
    }
  }

  /**
   * Lösche das AppClipboard. Ggf anstehende CUT-Operatioonen wirden dadurch 
   * zurück gecancelled.
   */
  onClearClipboard() {
    this.clipboardSvc.clear();
  }

  /**
   * Liefere die Anzahl aller Elemente im AppClipboard
   */
  get nrOfPastables(): number {
    return this.clipboardSvc.inodes.length;
  }

  /**
   * 
   * @param newNode 
   */
  createDocument(evt: CreateMenuEvent) {

    this.commonsDlgSvc.showInputBox('Ein neues Dokument anlegen', 'Name')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(name => {

        if (name) {

          if (evt.ext) {
            name = `${name}.${evt.ext}`;
          }

          this.inodeSvc.createDocument(evt.parent.uuid, name, evt.type)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(newNode => {

              this.addToModel([newNode]);
            })

        }
      })
  }

  /**
   * 
   * @param inode 
   */
  openINode(inode: INode) {
    this.openSvc.openINode(inode);
  }

  /**
   * 
   * @param newParent 
   * @param inodes 
   */
  copyINodes(newParent: INode, inodes: INode[]) {

    this.checkDuplicatesSvc.handleDuplicateINodes(newParent.uuid, inodes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sourceNodes => {

        this.inodeSvc.copy(sourceNodes, newParent)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(newNodes => {

            if (newParent.uuid === this.parent.uuid) {

              newNodes = this.setNewParent(newParent, newNodes);
              this.addToModel(newNodes);
            }
          })
      })
  }

  /**
   * 
   * @param newParent 
   * @param inodes 
   */
  moveINodes(newParent: INode, inodes: INode[]) {

    this.checkDuplicatesSvc.handleDuplicateINodes(newParent.uuid, inodes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sourceNodes => {

        this.inodeSvc.move(sourceNodes, newParent)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(newNodes => {

            this.deleteFromModel(sourceNodes);

            // TODO: reparenting!
            this.addToModel(newNodes);
          })
      })
  }

  /**
   * 
   * @param newParent 
   * @param inodes 
   */
  linkINodes(newParent: INode, inodes: INode[]) {

    this.checkDuplicatesSvc.handleDuplicateINodes(newParent.uuid, inodes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sourceNodes => {

        this.inodeSvc.link(sourceNodes, newParent)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(newNodes => {

            // TODO: reparenting!
            this.addToModel(newNodes);
          })
      })
  }

  private setNewParent(parent: INode, childs: INode[]): INode[] {

    const newNodes = childs.map(child => {
      return new INode(child.name, child.uuid, parent.uuid, child.linkTo, child.type, child.size, child.created, child.modified, child.acl);
    })

    return newNodes;
  }

  /**
   * 
   * @param inode
   */
  renameINode(inode: INode) {

    this.inodeSvc.rename(inode.uuid, inode.name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newNode => {
        this.updateInModel(inode);
      })
  }

  /**
   * 
   */
  onDelete() {

    const toDelete = new Array<INode>();
    this.selected.forEach(inode => {
      toDelete.push(inode);
    })

    this.deleteINodes(toDelete);
  }

  /**
   * 
   * @param inode
   */
  deleteINodes(inodes: INode[]) {

    const uuids = new Array<string>();
    let msg = '<p>Möchtest Du folgende Objekte wirklich löschen?</p>'
    inodes.forEach(node => {
      msg += `<div class=\"disp-flex flex-row flex-alignitems-center\">`;
      msg += `<img class=\"flex-0 small-right-spacer\" src=\"${this.contentTypeSvc.getTypeIconUrl(node.type)}\" width="32px">`;
      msg += `<span class=\"flex-1\">${node.name}</span>`;
      msg += `</div>`;
      uuids.push(node.uuid);
    })
    msg += '<p class=\"small-top-spacer\">Diese Operation kann nicht rückgängig gemacht werden!</p>';
    this.commonsDlgSvc.showQueryBox('Bist Du sicher?', msg).subscribe(rsp => {

      if (rsp) {

        const toDelete = inodes.map(inode => {
          return inode.uuid;
        })

        this.inodeSvc.delete(toDelete)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(deletedUUIDs => {
            this.deleteFromModelByUUID(deletedUUIDs); // TODO: Das stimmt so nicht, da ggf auch Links gelöscht wurden!
          })
      }
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about upload/download                                               */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Der Upload wurde durch die Toolbar getriggert. Dabei kommen die ausgewählten
   * Files aus einem (hidden) tnput[type=file], also als FileList.
   * 
   * Einfach transformieren und als "normalen" Upload für den currentTab
   * verarbeiten.
   * 
   * @param evt 
   */
  onToolbarUpload(evt: Event) {

    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length) {

      const files = new Array<File>();
      for (let i = 0; i < input.files.length; ++i) {
        files.push(input.files.item(i)!);
      }
      this.uploadFiles(new FilesDroppedEvent(this.parent, files));
    }
  }

  /**
   * 
   * @param parent 
   * @param files 
   */
  uploadFiles(event: FilesDroppedEvent) {

    this.uploadSvc.uploadFiles(event.target.uuid, event.files)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {

        if (rsp.duplicateFiles && rsp.duplicateFiles.length) {
          alert(JSON.stringify(rsp.duplicateFiles));
        }
        else {
          this.addToModel(rsp.newINodes);
        }
      })
  }

  /**
   * 
   */
  onDownloadFiles() {
    alert("FilesMainView::downloadFiles not yet implemented");
  }

  /**
   * 
   */
  onToggleHiddenFiles() {
    this.showHiddenFiles = !this.showHiddenFiles;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about model ops                                                     */
  /*                                                                         */
  /* Nach den diversen Backend-Operationen muss dementsprechend das Model    */
  /* angepasst werden.                                                       */
  /*-------------------------------------------------------------------------*/

  /**
   * Lösche die INodes aus dem Model. 
   *  
   * @param toDelete 
   */
  private deleteFromModel(inodes: INode[]) {

    const uuids = inodes.map(inode => inode.uuid);
    this.deleteFromModelByUUID(uuids);
  }


  /**
   * Lösche alle angegeben UUIDs aus dem Model. 
   * 
   *   
   * @param uuids 
   */
  private deleteFromModelByUUID(uuids: string[]) {

    const dict = new Set<string>(uuids);

    this.childs = this.childs.filter(child => {
      return !dict.has(child.uuid);
    })
  }

  /**
   * Füge neue INodes in das Model ein. Die neuen Nodes werden in alle Tabs mit
   * dem passenden Parent eingefügt.
   * 
   * @param inodes 
   */
  private addToModel(inodes: INode[]) {

    inodes.forEach(toAdd => {
      this.childs = this.childs.concat(...inodes);
      // TODO: Sortieren
    })
  }

  /**
   * 
   * @param inode 
   */
  private updateInModel(inode: INode) {

    // TODO: not yet implemented
  }

  onSendToDashboard(inode: INode) {

    this.inodeSvc.getOrCreateFolder(this.sessionSvc.currentUser.userId, '.dashboardLinks')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(baseFolder => {

        this.inodeSvc.link(inode, baseFolder)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(baseFolder => {

          })
      })
  }
}
