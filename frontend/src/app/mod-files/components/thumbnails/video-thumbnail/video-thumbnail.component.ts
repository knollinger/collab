import { Component, Input } from '@angular/core';
import { INodeService } from '../../../services/inode.service';
import { INode } from '../../../../mod-files-data/mod-files-data.module';

@Component({
  selector: 'app-video-thumbnail',
  templateUrl: './video-thumbnail.component.html',
  styleUrls: ['./video-thumbnail.component.css']
})
export class VideoThumbnailComponent {

  @Input()
  iconSize: string = '64px';

  iconUrl: string = '';
  type: string = '';

  /**
   * 
   * @param contentTypeSvc 
   */
  constructor(private inodeSvc: INodeService) {
  }


  @Input()
  set inode(inode: INode) {

    const url = this.inodeSvc.getContentUrl(inode.uuid);
    this.iconUrl = `${url}#t=0.1`;
    this.type = inode.type;
  }

  get width(): string {
    return this.iconSize;
  }
}
