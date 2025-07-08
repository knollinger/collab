import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardFilesService } from '../../../services/dashboard-files.service';
import { INode } from '../../../../mod-files-data/mod-files-data.module';

@Component({
  selector: 'app-files-widget',
  templateUrl: './files-widget.component.html',
  styleUrls: ['./files-widget.component.css'],
  standalone: false
})
export class FilesWidgetComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  inodes: INode[] = new Array<INode>();

  /**
   * 
   * @param inodeSvc 
   */
  constructor(private inodeSvc: DashboardFilesService) {

  }

  /**
   * 
   */
  ngOnInit() {

    this.inodeSvc.loadINodes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {
        this.inodes = inodes
      })
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  getMimetypeIcon(inode: INode): string {
    return this.inodeSvc.getMimetypeIcon(inode);
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  getRouterLink(inode: INode): string {

    if (inode.isDirectory()) {
      return `/files/main/${inode.uuid}`;
    }
    return `/viewer/show/${inode.uuid}`;
  }

  /**
   * 
   * @param inode 
   */
  onUnlinkINode(evt: Event, inode: INode) {
    evt.stopPropagation();
    alert('not yet implemented');
  }
}
