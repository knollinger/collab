import { Component, Input } from '@angular/core';
import { INode } from '../../../../mod-files-data/mod-files-data.module';
import { IThumbNail } from '../ithumbnail';
import { BackendRoutingService } from '../../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements IThumbNail {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getThumb', 'v1/filesys/thumbs/{1}']
    ]);

  @Input()
  iconSize: string = '64px';

  iconUrl: string = '';

  /**
   * 
   * @param contentTypeSvc 
   */
  constructor(private backendRouter: BackendRoutingService) {

  }


  /**
   * 
   */
  @Input()
  set inode(inode: INode) {
    this.iconUrl = this.backendRouter.getRouteForName('getThumb', ImageThumbnailComponent.routes, inode.uuid);
  }

  /**
   * 
   */
  get width(): string {
    return this.iconSize;
  }
}
