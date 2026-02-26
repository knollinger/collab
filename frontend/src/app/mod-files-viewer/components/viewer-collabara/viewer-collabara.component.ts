import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';

import { ActivatedRoute } from '@angular/router';
import { INodeService, WopiService } from '../../../mod-files/mod-files.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-viewer-collabara',
  templateUrl: './viewer-collabara.component.html',
  styleUrls: ['./viewer-collabara.component.css'],
  standalone: false
})
export class ViewerCollabaraComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private inode: INode = INode.empty();

  /**
   * 
   * @param wopiSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService,
    private wopiSvc: WopiService) {

  }

  /**
   * 
  */
  ngOnInit(): void {

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params.get('uuid') || '';
        this.inodeSvc.getINode(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(inode => {
            this.inode = inode;
            this.titleBarSvc.subTitle = inode.name;
          })

      })
  }

  get launcherFormUrl(): string {
    return this.wopiSvc.getLauncherFormUrl(this.inode);
  }

  get hasINode(): boolean {
    return !this.inode.isEmpty();
  }
}
