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

export class IconSize {

  constructor(
    public readonly size: string,
    public readonly text: string) {

  }
}

export class TabDescriptor {

  constructor(
    public parent: INode,
    public path: INode[],
    public childs: INode[],
    public selected: Set<INode>) {
  }

  public static empty() {
    return new TabDescriptor(INode.empty(), new Array<INode>(), new Array<INode>(), new Set<INode>());
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

  tabs: TabDescriptor[] = new Array<TabDescriptor>();

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
    private commonsDlgSvc: CommonDialogsService,
    private titlebarSvc: TitlebarService,
    private inodeSvc: INodeService,
    private clipboardSvc: ClipboardService,
    private sessionSvc: SessionService,
    private settingsSvc: SettingsService,
    private checkDuplicatesSvc: CheckDuplicateEntriesService,
    private contentTypeSvc: ContentTypeService,
    private uploadSvc: UploadService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'Dateien';
    this.loadSettings();
    this.newTab();
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the statusbar                                                 */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  get nrOfChilds(): number {
    return this.currentTab.childs.length;
  }

  /**
   * 
   */
  get totalChildSize(): number {

    let result = 0;
    this.currentTab.childs.forEach(child => {
      result += child.size;
    })
    return result;
  }

  /**
   * 
   */
  get selectedChildSize(): number {

    let result = 0;
    this.currentTab.selected.forEach(child => {
      result += child.size;
    })
    return result;
  }


  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about tabbing                                                       */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  public currTabIdx: number = 0;

  /**
   * 
   */
  public get currentTab(): TabDescriptor {

    return this.tabs[this.currTabIdx];
  }

  /**
   * Erzeuge einen neuen Tab mit dem HomeDirectory des Benutzers
   */
  public newTab() {

    const homeDirId = this.sessionSvc.currentUser.userId;
    this.addTab(homeDirId);
  }

  /** 
   * Erzeuge einen neuen Tab für die gegebene UUID
   * 
   * Es wird zunächst ein leerer TabDescriptor angelegt und in das Tab-Array
   * gepushed. Dadurch ist schon mal sicher gestellt, dass ein valider 
   * TaskDescriptor existiert.
   * 
   * Im Anschluss wird der Inhalt des Tabs asynchron geladen und in den 
   * Descriptor verfrachtet.
   */
  public addTab(uuid: string) {

    const desc = TabDescriptor.empty();
    this.currTabIdx = this.tabs.push(desc) - 1;
    this.loadTab(uuid, desc);
  }

  /**
   * 
   * @param idx 
   */
  public closeTab(idx: number) {

    if (this.tabs.length > 1) {
      this.tabs.splice(idx, 1);
      this.currTabIdx = Math.min(this.currTabIdx, this.tabs.length - 1);
    }
  }

  /**
   * Kann der Tab geschlossen werden?
   * 
   * Ein Tab kann geschlossen werden, wenn er nicht der letzte offene Tab ist
   * 
   * @returns 
   */
  public isCloseable(): boolean {
    return this.tabs.length > 1;
  }

  /**
   * 
   * @param idx 
   */
  public onTabChange(idx: number) {
    if (idx < this.tabs.length) {
      this.currTabIdx = idx;
    }
  }

  public onOpenInCurrentTab(inode: INode) {

    console.log('onOpenInCurrent')
    this.openFolder(this.currTabIdx, inode);
  }


  /**
   * Lade einen Tab anhand seiner ParentUUID.
   * 
   * Es wird die INode selbst geladen, der Path zur INode und seine Childs. 
   * Das Set mit den selektierten Childs wird leer angelegt.
   *  
   * @param uuid 
   * @param tabDesc
   */
  private loadTab(uuid: string, tabDesc: TabDescriptor) {

    this.inodeSvc.getINode(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(parentINode => {

        tabDesc.parent = parentINode;
        this.inodeSvc.getPath(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(path => {

            tabDesc.path = path;
            this.inodeSvc.getAllChilds(uuid)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(childs => {

                tabDesc.childs = childs;
              })
          })
      })
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

        // gespeicherte Tabs laden
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

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the toolbar                                                   */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Callback für den GoHome-Button. Der Pfad des aktiven Panels wird auf das
   * HomeDir des aktuellen Benutzers gesetzt.
   * 
   */
  onGoHome() {

    const homeDirId = this.sessionSvc.currentUser.userId;
    this.inodeSvc.getINode(homeDirId).subscribe(homeDir => {
      this.onOpenInCurrentTab(homeDir);
    })
  }

  /**
   * Den aktuellen Folder neu laden
   */
  onRefresh() {

    const tab = this.currentTab;
    this.onOpenInCurrentTab(tab.parent);
  }

  /**
   * Liefere die Anzahl von Selektierten INodes
   */
  get nrOfSelectedChilds(): number {

    return this.currentTab.selected.size;
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

    const selected = new Set<INode>(this.currentTab.childs.filter(child => {

      let result = this.showHiddenFiles;
      if (!result) {
        result = !child.isHidden();
      }
      return result;
    }));

    this.currentTab.selected = selected;
  }

  /**
   * hebe die Auswahl in der aktuellen SubPane auf
   */
  onDeselectAll() {
    this.currentTab.selected.clear();
  }

  /**
   * 
   * @param tabIdx 
   * @param selections 
   */
  onSelectionChange(tabIdx: number, selections: Set<INode>) {

    this.currentTab.selected = selections;
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

    const toCut = new Array<INode>(...this.currentTab.selected);
    this.clipboardSvc.cut(toCut);
  }

  /**
   * Kopiere alle selektierten INodes in das App-Clipboard
   */
  onCopy() {
    const toCopy = new Array<INode>(...this.currentTab.selected);
    this.clipboardSvc.copy(toCopy);
  }

  /**
   * Kopiere Links auf alle selektierten INodes in das App-Clipboard
   */
  onLink() {
    const toLink = new Array<INode>(...this.currentTab.selected);
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

    const newParent = this.currentTab.parent;

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
  openINode(tabIdx: number, inode: INode) {

    if (inode.isDirectory()) {
      this.openFolder(tabIdx, inode);
    }
    else {
      this.openDocument(inode);
    }
  }

  /**
 * 
 * @param tabId 
 * @param inode 
 */
  private openFolder(tabId: number, inode: INode) {

    const tabDesc = this.tabs[tabId];
    this.loadTab(inode.uuid, tabDesc);
  }

  /**
   * 
   * @param inode 
   */
  private openDocument(inode: INode) {
    const url = `/viewer/show/${inode.uuid}`;
    this.router.navigateByUrl(url);

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

            this.addToModel(newNodes);
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

            this.addToModel(newNodes);
          })
      })
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
    this.currentTab.selected.forEach(inode => {
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
      this.uploadFiles(new FilesDroppedEvent(this.currentTab.parent, files));
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
  /* Die Komponente hält ein Model, welches alle Tabs beschreibt. Pro Tab    */
  /* wird der Parent, die Liste der Childs, und der SelectionState der Childs*/
  /* verwaltet.                                                              */
  /*                                                                         */
  /* Nach den diversen Backend-Operationen muss dementsprechend das Model    */
  /* angepasst werden. Dabei gilt es zu beachten, das der selbe Folder in    */
  /* mehreren Tabs geöffnet sein kann!                                       */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Lösche die INodes aus dem Model. Sie werden aus allen im Model verfügbaren
   * Tabs entfernt, ggf werden auch offene (und nun gelöschte) Tabs geschlossen.
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
   * Eventuell offene Tabs deren Parents gelöscht wurden werden geschlossen. Aus allen
   * verbleibenden Tabs werden alle INodes mit den gelöschten UUIDs entfernt.
   *   
   * @param uuids 
   */
  private deleteFromModelByUUID(uuids: string[]) {

    console.log('deleteFromModelByUUID');
    // Zuerst ggf gelöschte Tabs entfernen
    this.tabs = this.tabs.filter(tab => {
      return uuids.indexOf(tab.parent.uuid) === -1;
    })

    this.tabs.forEach(tab => {
      tab.childs = tab.childs.filter(child => {
        return uuids.indexOf(child.uuid) === -1;
      })
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
      this.tabs.forEach(tab => {
        if (tab.parent.uuid === toAdd.parent) {
          tab.childs = tab.childs.concat(toAdd);
          // TODO: Sortieren
        }
      })
    })
  }

  /**
   * 
   * @param inode 
   */
  private updateInModel(inode: INode) {

    this.tabs.forEach(tab => {
      if (tab.parent.uuid === inode.parent) {

        for (let i = 0; i < tab.childs.length; ++i) {
          if (tab.childs[i].uuid === inode.uuid) {
            tab.childs[i] = inode;
            break;
          }
        }
        // TODO: Sortieren
      }
    })
  }
}
