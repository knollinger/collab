import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AutoUnSubscribe,
  TitlebarService
} from '../../../mod-commons/mod-commons.module';

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

@AutoUnSubscribe
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

    this.titlebarSvc.subTitle = 'Datei-Verwaltung';
    this.route.params.subscribe(params => {

      const uuid = params['uuid'] || EINodeUUIDs.INODE_ROOT;
      this.inodeSvc.getINode(uuid).subscribe(inode => {

        this.currentFolder = inode;
      })
    });
  }

  /**
   * 
   */
  onToggleSplitView() {

    if (this.showSplit) {
      this.activeView = 0;
    }
    this.showSplit = !this.showSplit;
  }

  /**
   * 
   * @param id 
   */
  onActivateView(id: number) {
    this.activeView = id;
  }

  /**
   * 
   */
  get isView1Active(): boolean {

    return this.activeView === 0;
  }

  /**
   * 
   */
  get isView2Active(): boolean {

    return this.activeView === 1;
  }

  onShowPreview(inode: INode) {

    this.previewINode = inode;
  }

  get showPreview(): boolean {
    return !this.previewINode.isEmpty();
  }

  onClosePreview() {
    this.previewINode = INode.empty();
  }
}
