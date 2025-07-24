import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardFilesService } from '../../../services/dashboard-files.service';
import { INode } from '../../../../mod-files-data/mod-files-data.module';
import { Router } from '@angular/router';

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
  constructor(
    private router: Router,
    private inodeSvc: DashboardFilesService) {

  }

  /**
   * 
   */
  ngOnInit() {
    this.loadINodes();
  }

  private loadINodes() {

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

  onOpen(inode: INode) {

    const url = inode.isDirectory() ? `/files/main/${inode.uuid}` : `/viewer/show/${inode.uuid}`;
    this.router.navigateByUrl(url);
  }

  onRemove(evt: Event, inode: INode) {

    this.inodeSvc.unlinkINode(inode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.loadINodes();
      });
  }
}
