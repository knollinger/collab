import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { INodeService } from '../../../mod-files/mod-files.module';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { INode } from '../../../mod-files-data/mod-files-data.module';

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
  private currIdx: number = 0;
  
  allImages: INode[] = new Array<INode>();
  showGallery: boolean = false;


  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService) {

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params.get('uuid') || '';
        this.loadImages(uuid);
      })
  }

  /**
   * Lade alle Image-ChildNodes
   */
  private loadImages(refUUID: string): void {

    this.inodeSvc.getINode(refUUID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inode => {

        this.titleBarSvc.subTitle = inode.name;

        this.inodeSvc.getAllChilds(inode.parent)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(childs => {

            this.allImages = childs.filter(inode => { return inode.type.startsWith('image/') });
            this.currIdx = this.allImages.findIndex(img => {
              return img.uuid === refUUID;
            })
          })
      })
  }

  /**
   * 
   */
  get sourceUrl(): string {

    const uuid = this.allImages[this.currIdx].uuid;
    return this.inodeSvc.getContentUrl(uuid);
  }

  getGallerySrcUrl(inode: INode): string {
    return this.inodeSvc.getContentUrl(inode.uuid);
  }

  /**
   * 
   */
  onGoLeft() {

    if (this.currIdx > 0) {
      this.currIdx--;
    }
    else {
      this.currIdx = this.allImages.length - 1;
    }
    this.titleBarSvc.subTitle = this.allImages[this.currIdx].name;
  }

  /**
   * 
   */
  onGoRight() {

    if (this.currIdx < this.allImages.length - 1) {
      this.currIdx++;
    }
    else {
      this.currIdx = 0;
    }
    this.titleBarSvc.subTitle = this.allImages[this.currIdx].name;
  }

  onToggleGallery() {
    this.showGallery = !this.showGallery;
  }

  isSelected(idx: number): boolean {
    return this.currIdx === idx;
  }

  selectByIdx(idx: number) {
    this.currIdx = idx;
  }
}
