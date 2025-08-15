import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { INode } from '../../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../../mod-files/mod-files.module';

import { Router } from '@angular/router';
import { SessionService } from '../../../../mod-session/session.module';

@Component({
  selector: 'app-files-widget',
  templateUrl: './files-widget.component.html',
  styleUrls: ['./files-widget.component.css'],
  standalone: false
})
export class FilesWidgetComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  baseFolder: INode = INode.empty();
  inodes: INode[] = new Array<INode>();

  /**
   * 
   * @param dashSvc 
   */
  constructor(
    private router: Router,
    private sessionSvc: SessionService,
    private inodeSvc: INodeService) {

  }

  /**
   * 
   */
  ngOnInit() {

    this.inodeSvc.getOrCreateFolder(this.sessionSvc.currentUser.userId, '.dashboardLinks')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(baseFolder => {

        this.baseFolder = baseFolder;
        this.loadINodes();
      })
  }

  onOpen(inode: INode) {

    const url = inode.isDirectory() ? `/files/main/${inode.uuid}` : `/viewer/show/${inode.uuid}`;
    this.router.navigateByUrl(url);
  }

  onRemove(evt: Event, inode: INode) {

    evt.stopPropagation();
    this.inodeSvc.delete([inode.uuid])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.loadINodes();
      });
  }

  private loadINodes() {

    this.inodeSvc.getAllChilds(this.baseFolder.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {

        this.inodes = inodes.sort(this.sortINodes);
      })
  }

  private sortINodes(inode1: INode, inode2: INode): number {

    if (inode1.isDirectory() && inode2.isDirectory()) {
      return inode1.name.localeCompare(inode2.name);
    }
    else {
      if (inode1.isDirectory()) {
        return -1;
      }
      else {
        if (inode2.isDirectory()) {
          return 1;
        }
        else {
          return inode1.name.localeCompare(inode2.name);
        }
      }
    }
  }
}
