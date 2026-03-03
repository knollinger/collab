import { Component, Input } from '@angular/core';
import { INode } from '../../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../services/inode.service';
import { IThumbNail } from '../ithumbnail';

@Component({
  selector: 'app-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements IThumbNail{

  @Input()
  iconSize: string = '64px';

  iconUrl: string = '';

  /**
   * 
   * @param contentTypeSvc 
   */
  constructor(private inodeSvc: INodeService) {
  }


  @Input()
  set inode(inode: INode) {
    this.iconUrl = `url('${this.inodeSvc.getContentUrl(inode.uuid)}'`;
  }

  get width(): string {
    return this.iconSize;
  }
}
