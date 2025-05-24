import { Directive, HostBinding, HostListener, Input } from '@angular/core';

import { INode } from "../../mod-files-data/mod-files-data.module";

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

  @HostBinding()
  draggable: string = 'true';

  /**
   *
   */
  @HostListener('dragstart', ['$event'])
  onDragStart(evt: DragEvent) {

    if (evt.dataTransfer && this.checkPermsSvc.hasPermissions(Permissions.READ, this.appINodeDragSource)) {

      evt.dataTransfer.clearData();
      evt.dataTransfer.setData(INode.DATA_TRANSFER_TYPE, JSON.stringify(this.appINodeDragSource.toJSON()));
      evt.dataTransfer.dropEffect = 'move';
    }
    else {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}

