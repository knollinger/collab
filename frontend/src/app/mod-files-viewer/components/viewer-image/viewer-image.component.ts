import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { INodeService } from '../../../mod-files/mod-files.module';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

/**
 * 
 */
@Component({
  selector: 'app-viewer-image',
  templateUrl: './viewer-image.component.html',
  styleUrls: ['./viewer-image.component.css'],
  standalone: false
})
export class ViewerImageComponent {

  private destroyRef = inject(DestroyRef);

  currId: string = '';
  allSiblings: string[] = new Array<string>();


  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService) {

    route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params.get('uuid');
        this.currId = uuid || '';
        this.loadSiblingImages();
      })
  }

  /**
   * Lade alle Image-ChildNodes
   */
  private loadSiblingImages(): void {

    this.inodeSvc.getINode(this.currId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inode => {

        this.titleBarSvc.subTitle = inode.name;

        this.inodeSvc.getAllChilds(inode.parent)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(childs => {

            const filtered = childs.filter(inode => { return inode.type.startsWith('image/') });
            this.allSiblings = filtered.map(child => child.uuid);
          })
      })
  }

  /**
   * 
   */
  sourceUrl(uuid: string): string {
    return this.inodeSvc.getContentUrl(uuid);
  }

  isSelected(uuid: string): boolean {
    return this.currId === uuid;
  }
}
