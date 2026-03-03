import { Component, Input } from '@angular/core';
import { ContentTypeService } from '../../../services/content-type.service';
import { INode } from '../../../../mod-files-data/mod-files-data.module';
import { IThumbNail } from '../ithumbnail';

/**
 * Implementiert die Default-Darstellung eines Thumbnails. Es wird einfach das
 * dem MimeType der Inode entsprechende Icon dargestellt.
 */
@Component({
  selector: 'app-default-thumbnail',
  templateUrl: './default-thumbnail.component.html',
  styleUrls: ['./default-thumbnail.component.css']
})
export class DefaultThumbnailComponent implements IThumbNail {

  @Input()
  iconSize: string = '64px';
  
  iconUrl: string = '';

  /**
   * 
   * @param contentTypeSvc 
   */
  constructor(private contentTypeSvc: ContentTypeService) {
  }

  @Input()
  set inode(inode: INode) {
    this.iconUrl = this.contentTypeSvc.getTypeIconUrl(inode.type);
  }

  get width(): string {
    return this.iconSize;
  }
}
