import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../services/inode.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-files-breadcrumb',
  templateUrl: './files-breadcrumb.component.html',
  styleUrls: ['./files-breadcrumb.component.css']
})
export class FilesBreadcrumbComponent {

  private _parent: INode = INode.empty();
  private destroyRef: DestroyRef = inject(DestroyRef);
  
  path: INode[] = new Array<INode>();

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();
  
  /**
   * 
   * @param inodeSvc 
   */
  constructor(private inodeSvc: INodeService) {

  }

  @Input()
  set parent(inode: INode) {

    this._parent = inode;
    this.inodeSvc.getPath(inode.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(path => {
        this.path = path;
      })
  }

  openINode(inode: INode) {
    this.open.next(inode);
  }
}
