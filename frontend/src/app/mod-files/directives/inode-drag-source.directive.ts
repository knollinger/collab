import { Directive, Host, HostBinding, HostListener, inject, Input } from '@angular/core';

import { INode } from "../../mod-files-data/mod-files-data.module";

import { ContentTypeService } from '../services/content-type.service';
import { ACLEntry, CheckPermissionsService } from '../../mod-permissions/mod-permissions.module';

@Directive({
  selector: '[appINodeDragSource]',
  standalone: false
})
export class INodeDragSourceDirective {

  private static multiNodeDragImage: HTMLImageElement | null = null;

  constructor(
    private checkPermsSvc: CheckPermissionsService,
    private contentTypeSvc: ContentTypeService) {

    this.ensureMultiNodeDragImageAvailable();
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

    if (!evt.dataTransfer || !this.checkPermsSvc.hasPermissions(this.appINodeDragSource.acl, ACLEntry.PERM_READ)) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    else {

      const allNodes = this.getAllNodes();
      const json = allNodes.map(node => {
        return node.toJSON();
      })

      evt.dataTransfer.clearData();
      evt.dataTransfer.setData(INode.DATA_TRANSFER_TYPE, JSON.stringify(json));
      evt.dataTransfer.dropEffect = 'move';

      /*
       * Wenn mehrere Nodes gedragged werden sollen, wird das feste MultiNodeImage
       * angezeigt. Anderenfalls sichen wir nach dem ersten Image innerhalb des 
       * EventTargets. Wenn auch hier nichts gefunden wurde bleibt es beim default-
       * Verhalten.
       */
      if (allNodes.length > 1 && INodeDragSourceDirective.multiNodeDragImage) {
        evt.dataTransfer.setDragImage(INodeDragSourceDirective.multiNodeDragImage, 0, 0);
      }
      else {
        const img = this.findDragImage(evt);
        if (img) {
          evt.dataTransfer.setDragImage(img, 0, 0);
        }
      }
    }
  }

  private findDragImage(evt: DragEvent): Element | null {

    const src = evt.currentTarget as Element;
    if (src.tagName === 'IMG') {
      return src;
    }

    const childs = src.getElementsByTagName('img');
    if (childs.length) {
      return childs.item(0);
    }
    return null;
  }

  /**
   * 
   * @returns 
   */
  private getAllNodes(): INode[] {
    const allNodes = new Set<INode>(this.appINodeDragSourceSelectedINodes);
    allNodes.add(this.appINodeDragSource);
    return Array.from(allNodes);
  }

  /**
   * Liefere das Image zum anzeigen einer MultiNode-Drag-Op.
   * 
   * Das ganze ist nicht trivial, das Image muss zwingend ein 
   * **sichtbares DOM-Element** des aktuellen Dokumentes sein.
   * 
   * Wir erzeugen also eine Singleton-Instanz eines 
   * HTMLImgElement, fügen dieses an den document.body an
   * und verpassen ihm einen zIndex < 0. Dadurch liegt das
   * Teil *hinter* dem ganzen anderen Kram, der User  merkt 
   * nichts davon und das Element gilt als "visible".
   * 
   * @returns 
   */
  private ensureMultiNodeDragImageAvailable() {

    if (!INodeDragSourceDirective.multiNodeDragImage) {

      const img = document.createElement('img');

      img.setAttribute('style', 'position: absolute; top: 0; left: 0; z-index: -1;');
      img.src = this.contentTypeSvc.getTypeIconUrl('document/multiple')
      document.body.appendChild(img);

      INodeDragSourceDirective.multiNodeDragImage = img;
    }
  }
}

