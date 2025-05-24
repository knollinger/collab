import { Component, DestroyRef, inject, Input } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  private _currINode: INode = INode.empty();

  @Input()
  set inode(node: INode) {
    this._currINode = node;
    this.loadSiblingImages();
  }

  get inode(): INode {
    return this._currINode;
  }

  allImages: INode[] = new Array<INode>();

  /**
   * 
   * @param inodeSvc 
   */
  constructor(private inodeSvc: INodeService) {


  }

  /**
   * Lade alle Image-ChildNodes
   */
  private loadSiblingImages(): void {

    this.inodeSvc.getAllChilds(this.inode.parent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {

        this.allImages = inodes.filter(inode => { return inode.type.startsWith('image/') });
        console.dir(this.allImages);
      })
  }

  /**
   * 
   */
  sourceUrl(inode: INode): string {
    return this.inodeSvc.getContentUrl(inode.uuid);
  }

  isSelected(inode: INode): boolean {
    return this.inode.uuid === inode.uuid;
  }
}
