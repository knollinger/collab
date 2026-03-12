import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { INodeService, ContentTypeService, ImageThumnailService } from '../../../mod-files.module';
import { INode } from '../../../../mod-files-data/mod-files-data.module';
import { IThumbNail } from '../ithumbnail';

@Component({
  selector: 'app-audio-thumbnail',
  templateUrl: './audio-thumbnail.component.html',
  styleUrls: ['./audio-thumbnail.component.css'],
  standalone: false
})
export class AudioThumbnailComponent implements IThumbNail {

  private static coverCache: Map<string, string> = new Map<string, string>();

  private destroyRef = inject(DestroyRef);
  imgUrl: string = '';

  /**
   * 
   * @param inodeSvc 
   * @param contentTypeSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private contentTypeSvc: ContentTypeService,
    private imgThumbSvc: ImageThumnailService) {
  }

  @Input()
  iconSize: string = '64px';

  @Input()
  set inode(inode: INode) {

    let coverUrl = AudioThumbnailComponent.coverCache.get(inode.parent);
    if (coverUrl) {
      this.imgUrl = coverUrl;
    }
    else {
      this.imgUrl = this.contentTypeSvc.getTypeIconUrl(inode.type);

      this.inodeSvc.getAllChilds(inode.parent, false)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(childs => {

          for (let child of childs) {

            if (child.type.startsWith('image/')) {

              coverUrl = this.imgThumbSvc.getImageThumbnailUrl(child);
              AudioThumbnailComponent.coverCache.set(inode.parent, coverUrl);
              this.imgUrl = coverUrl;
              break;
            }
          }
        })
    }
  }
}
