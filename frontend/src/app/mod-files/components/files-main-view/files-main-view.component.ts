import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

import { EINodeUUIDs, INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';

/**
 * Die Haupt-Component der Files-Ansicht
 */
@Component({
  selector: 'app-files-main-view',
  templateUrl: './files-main-view.component.html',
  styleUrls: ['./files-main-view.component.css'],
})

export class FilesMainViewComponent implements OnInit, OnDestroy {

  @Input()
  public viewMode: string = 'grid';

  @Input()
  public showSplit: boolean = false;

  @Output()
  public viewModeChange: EventEmitter<string> = new EventEmitter<string>();

  public currentFolder: INode = INode.root();
  public inodes: INode[] = new Array<INode>();
  public path: INode[] = new Array<INode>();
  public selectedINodes: Set<INode> = new Set<INode>();
  public previewINode: INode = INode.empty();
  public iconSize: number = 128;

  activeView: number = 0;


  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titlebarSvc: TitlebarService,
    private inodeSvc: INodeService) {

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
    this.route.params.subscribe(params => {

      const uuid = params['uuid'] || EINodeUUIDs.INODE_ROOT;
      this.inodeSvc.getINode(uuid).subscribe(inode => {

        this.currentFolder = inode;
      })
    });
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about view splitting                                                */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

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
    }
    this.showSplit = !this.showSplit;
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
