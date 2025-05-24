import { Component, Input } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';

@Component({
  selector: 'app-viewer-movie',
  templateUrl: './viewer-movie.component.html',
  styleUrls: ['./viewer-movie.component.css'],
  standalone: false
})
export class ViewerMovieComponent {

  @Input()
  inode: INode = INode.empty();

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private inodeSvc: INodeService) {
  }

  sourceUrl(): string {
    return this.inodeSvc.getContentUrl(this.inode.uuid);
  }
}
