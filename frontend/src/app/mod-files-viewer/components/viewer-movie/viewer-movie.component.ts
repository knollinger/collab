import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-viewer-movie',
  templateUrl: './viewer-movie.component.html',
  styleUrls: ['./viewer-movie.component.css'],
  standalone: false
})
export class ViewerMovieComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private inode: INode = INode.empty()

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService) {
  }

  ngOnInit() {

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

  get sourceUrl(): string {
    return this.inodeSvc.getContentUrl(this.inode.uuid);
  }

  get type(): string {
    return this.inode.type;
  }

  get hasINode(): boolean {
    return !this.inode.isEmpty();
  }
}
