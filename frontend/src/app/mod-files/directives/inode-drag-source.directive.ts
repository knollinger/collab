import { Directive, HostBinding, HostListener, Input } from '@angular/core';

import { IINode, INode } from "../../mod-files-data/mod-files-data.module";

import { CheckPermissionsService } from '../services/check-permissions.service';
import { Permissions } from '../models/permissions';

@Directive({
  selector: '[appINodeDragSource]',
  standalone: false
})
export class INodeDragSourceDirective {

  constructor(private checkPermsSvc: CheckPermissionsService) {

  }

  @Input()
  appINodeDragSource: INode = INode.empty();

  @Input()
  appINodeDragSourceSelectedINodes: Set<INode> = new Set<INode>();

  @HostBinding()
  draggable: string = 'true';

  /**
   *
   */
  @HostListener('dragstart', ['$event'])
  onDragStart(evt: DragEvent) {

    if (evt.dataTransfer && this.checkPermsSvc.hasPermissions(Permissions.READ, this.appINodeDragSource)) {

      evt.dataTransfer.clearData();
      evt.dataTransfer.setData(INode.DATA_TRANSFER_TYPE, JSON.stringify(this.composeEventPayload()));
      evt.dataTransfer.dropEffect = 'move';
    }
    else {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  /**
   * 
   * @returns 
   */
  private composeEventPayload(): IINode[] {

    const allNodes = new Set<INode>(this.appINodeDragSourceSelectedINodes);
    allNodes.add(this.appINodeDragSource);
    const result = Array.from(allNodes);
    return result.map(inode => {
      return inode.toJSON();
    });
  }
}

