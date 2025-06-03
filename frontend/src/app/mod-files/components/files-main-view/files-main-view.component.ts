import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';

import { FilesFolderViewComponent } from '../files-folder-view/files-folder-view.component';

import { EINodeUUIDs, INode } from '../../../mod-files-data/mod-files-data.module';

import { INodeService } from '../../services/inode.service';

/**
 * Die Haupt-Component der Files-Ansicht
 */
@Component({
  selector: 'app-files-main-view',
  templateUrl: './files-main-view.component.html',
  styleUrls: ['./files-main-view.component.css'],
  standalone: false
})

export class FilesMainViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private destroyRef = inject(DestroyRef);

  @Input()
  public viewMode: string = 'grid';

  @Input()
  public showSplit: boolean = false;

  @Output()
  public viewModeChange: EventEmitter<string> = new EventEmitter<string>();

  public leftPanelFolder: INode = INode.empty();
  public rightPanelFolder: INode = INode.empty();

  public currentFolder: INode = INode.root();
  public inodes: INode[] = new Array<INode>();
  public path: INode[] = new Array<INode>();
  public selectedINodes: Set<INode> = new Set<INode>();
  public previewINode: INode = INode.empty();
  public iconSize: number = 128;

  @ViewChild('leftPane')
  leftPane: ElementRef<FilesFolderViewComponent> | null = null;

  @ViewChild('rightPane')
  rightPane: ElementRef<FilesFolderViewComponent> | null = null;

  activeView: number = 0;


  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titlebarSvc: TitlebarService,
    private inodeSvc: INodeService,
    private sessionSvc: SessionService) {

  }

  /**
   * 
   */
  ngOnDestroy(): void {
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'Dateien';

    this.route.params
      // .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => { // takeUntilDestroyed

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
   * 
   */
  ngAfterViewInit() {
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about view splitting                                                */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * liefere den aktuellen FolderView
   */
  get currentFolderView(): FilesFolderViewComponent {

    const elemRef = this.activeView === 0 ? this.leftPane : this.rightPane;
    return elemRef!.nativeElement;
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
      this.activeView = 0;
      this.showSplit = false;
      this.rightPanelFolder = INode.empty();
    }
    else {
      this.showSplit = true;
      this.rightPanelFolder = this.leftPanelFolder;
    }
    const route = `/files/${this.leftPanelFolder.uuid}/${this.rightPanelFolder.uuid}`;
    this.router.navigateByUrl(route);
  }

  /**
   * 
   * @param panelId 
   * @param inode 
   */
  onOpenFolder(panelId: number, inode: INode) {

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
   * In einem SplitView wurde einer der beiden Views angeklickt.
   * Also entweder die WorkingArea, ein aktiver Button in der 
   * Toolbar oder die Status-Zeile :-)
   * 
   * @param viewId entweder 0 (für die linke SplitView) oder 
   *               1 für die rechte SplitView
   * @param activeFolder der Folder, welcher in der aktivierten 
   *                     FolderView angezeigt wird.
   */
  onActivateView(viewId: number, activeFolder: INode) {
    this.activeView = viewId;
  }

  /**
   * ist der angegebene SplitView aktiv?
   */
  public isViewActive(id: number): boolean {

    return this.activeView === id;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about pteview                                                       */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * aktiviere die Preview
   * 
   * @param inode die anzuzeigende INode
   */
  onShowPreview(inode: INode) {

    this.previewINode = inode;
  }

  /**
   * 
   */
  get showPreview(): boolean {
    return !this.previewINode.isEmpty();
  }

  onClosePreview() {
    this.previewINode = INode.empty();
  }
}
