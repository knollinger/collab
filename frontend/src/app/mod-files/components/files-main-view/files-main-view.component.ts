import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';

import { FilesFolderViewComponent } from '../files-folder-view/files-folder-view.component';

import { EINodeUUIDs, INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeService } from '../../services/inode.service';
import { ClipboardService } from '../../services/clipboard.service';
import { CreateMenuEvent } from '../files-create-menu/files-create-menu.component';

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

  public viewMode: string = 'grid';
  public iconSize: number = 128;

  @ViewChild('leftPane')
  leftPane: FilesFolderViewComponent | null = null;

  @ViewChild('rightPane')
  rightPane: FilesFolderViewComponent | null = null;

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titlebarSvc: TitlebarService,
    private inodeSvc: INodeService,
    private clipboardSvc: ClipboardService,
    private sessionSvc: SessionService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'Dateien';

    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const leftPanelUUID = params['leftPanel'] || this.sessionSvc.currentUser.userId;
        this.inodeSvc.getINode(leftPanelUUID)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(inode => {

            this.leftPanelFolder = inode;

            const rightPanelUUID = params['rightPanel'] || EINodeUUIDs.INODE_NONE;
            if (!rightPanelUUID || rightPanelUUID === EINodeUUIDs.INODE_NONE) {
              this.rightPanelFolder = INode.empty();
              this.showSplit = false;
            }
            else {
              this.inodeSvc.getINode(rightPanelUUID)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(inode => {
                  this.rightPanelFolder = inode;
                })
              this.showSplit = true;
            }
          })
      });
  }

  /**
   * all about view splitting
   */
  private _activePaneId: number = 0;
  public showSplit: boolean = false;
  public leftPanelFolder: INode = INode.empty();
  public rightPanelFolder: INode = INode.empty();

  public set activePane(val: number) {

    this._activePaneId = (val !== 0) ? 1 : 0;
  }

  public get activePane(): number {
    return this._activePaneId;
  }

  /**
   * Callback für den GoHome-Button. Der Pfad des aktiven Panels wird auf das
   * HomeDir des aktuellen Benutzers gesetzt.
   * 
   */
  onGoHome() {

    this.currentPane.onGoHome();

  }

  onRefresh() {
    this.currentPane.refresh();
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about selection                                                     */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * ist in einer der SubPanes wenigstens eine INode selektiert?
   */
  get hasSelection(): boolean {

    const pane = this.currentPane; 
    return pane && pane.selectedINodes.size > 0;
  }

  /**
   * Wähle in der aktuellen SubPane alle INodes aus
   */
  onSelectAll() {
    this.currentPane.onSelectAll();
  }

  /**
   * hebe die Auswahl in der aktuellen SubPane auf
   */
  onDeselectAll() {
    this.currentPane.onDeselectAll();
  }

  /**
   * schalte den SelectionFrame in der aktuelle SubPane ein/aus
   */
  onToggleSelectionFrame() {
    this.currentPane.onToggleSelectionFrame();
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about clipbord actions                                              */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  onCut() {
    this.currentPane.onCut();
  }

  onCopy() {
    this.currentPane.onCopy();
  }

  onPaste() {
    this.currentPane.onPaste();
  }

  onClearClipboard() {
    this.clipboardSvc.clear();
  }

  get nrOfPastables(): number {
    return this.clipboardSvc.inodes.length;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about upload/download                                               */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  onUpload(evt: Event) {

    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length) {
      this.currentPane.onFileUpload(files);
    }
  }

  onDownloadFiles() {
    alert('not yet implemented');
  }

  onDelete() {
    this.currentPane.onDelete();
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about view splitting                                                */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * liefere den aktuellen FolderView
   */
  get currentPane(): FilesFolderViewComponent {

    const elemRef = this.activePane === 0 ? this.leftPane : this.rightPane;
    return elemRef!;
  }

  get currentFolder(): INode {

    return this.activePane === 0 ? this.leftPanelFolder : this.rightPanelFolder;
  }

  /**
   * Aktiviere/deaktiviere den SplitView
   * 
   * Das UI-Control ist ein mat-toggle-button. Im Endeffekt eine Checkbox.
   * 
   * Wenn der SplitView aktiviert wird, so wird einfach der neue View neben 
   * dem bestehenden angezeigt.
   * 
   * Wenn der SplitView deaktiviert wird, so wird der activeView wieder auf 
   * 0 gesetzt
   */
  onToggleSplitView() {

    if (this.showSplit) {
      this.activePane = 0;
      this.showSplit = false;
      this.rightPanelFolder = INode.empty();
      this.onOpen(0, this.leftPanelFolder);
    }
    else {
      this.showSplit = true;
      this.onOpen(1, this.leftPanelFolder);
    }
  }

  /**
   * 
   * @param panelId 
   * @param inode 
   */
  onOpen(panelId: number, inode: INode) {

    if (inode.isDirectory()) {
      this.openFolder(panelId, inode);
    }
    else {
      this.openDocument(inode);
    }
  }

  /**
   * 
   * @param panelId 
   * @param inode 
   */
  private openFolder(panelId: number, inode: INode) {

    switch (panelId) {
      case 0:
        this.leftPanelFolder = inode;
        break;

      case 1:
        this.rightPanelFolder = inode;
        break;

      default:
        break;
    }

    // baue die Route und navigiere dorthin
    const route = `/files/main/${this.leftPanelFolder.uuid}/${this.rightPanelFolder.uuid}`;
    this.router.navigateByUrl(route);
  }

  /**
   * 
   * @param inode 
   */
  private openDocument(inode: INode) {
    const url = `/viewer/show/${inode.uuid}`;
    this.router.navigateByUrl(url);

  }

  onCreateDocument(evt: CreateMenuEvent) {

    this, this.currentPane.onCreateDocument(evt);
  }
}
