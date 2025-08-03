import { Component, DestroyRef, inject, Input } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-viewer-audio',
  templateUrl: './viewer-audio.component.html',
  styleUrls: ['./viewer-audio.component.css'],
  standalone: false
})
export class ViewerAudioComponent {

  private destroyRef = inject(DestroyRef);
  private _imageINode: INode = INode.empty();
  private _audioINode: INode = INode.empty();

  @Input()
  set inode(inode: INode) {

    this._audioINode = inode;
    this.tryToLoadImage(inode);
  }

  get inode(): INode {
    return this._audioINode;
  }

  getImageUrl(): string {

    let result = '';
    if (!this._imageINode.isEmpty()) {
      result = this.inodeSvc.getContentUrl(this._imageINode.uuid);
    }
    return result;
  }

  /**
   * 
   * 
   * @param inodeSvc 
   */
  constructor(
    private inodeSvc: INodeService) {
  }

  sourceUrl(): string {
    return this.inodeSvc.getContentUrl(this.inode.uuid);
  }

  private tryToLoadImage(audioINode: INode) {

    this.inodeSvc.getAllChilds(audioINode.parent, false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(childs => {

        for (let child of childs) {
          if (child.type.startsWith('image/')) {
            this._imageINode = child;
            break;
          }
        }
      })
  }
}
