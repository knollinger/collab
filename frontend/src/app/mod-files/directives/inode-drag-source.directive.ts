import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { INode } from '../models/inode';

@Directive({
  selector: '[appINodeDragSource]'
})
export class INodeDragSourceDirective {

  @Input()
  appINodeDragSource: INode = INode.empty();

  @HostBinding()
  draggable: string = 'true';

  /**
   *
   */
  @HostListener('dragstart', ['$event'])
  onDragStart(evt: DragEvent) {

    if (evt.dataTransfer) {

      evt.dataTransfer.clearData();
      evt.dataTransfer.setData(INode.DATA_TRANSFER_TYPE, JSON.stringify(this.appINodeDragSource.toJSON()));
      evt.dataTransfer.dropEffect = 'move';
    }
  }
}

