import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { INodeDroppedEvent } from '../../directives/drop-target.directive';
import { MatMenuTrigger } from '@angular/material/menu';

/**
 * Die FileDropINodeMenuComponent stellt ein Auswahl-Menu für die Auswahl der
 * Operationen beim Drop einer INode dar. Folgende Operationen werden ageboten:
 * 
 * * Copy
 * * Move
 * * Link
 * 
 * Am einfachsten wird das Menu in die verwendende Komponent embedded und mittels
 * einem EventBinding an einer DropTargetDirective (event inodesDropped) gebunden.
 * Das dort generierte Event kann direkt in die show()-Methode des Menus 
 * übergeben werden.
 * 
 * Je nach auswahl im Menu werden die Output-Events (copy, move, link) getriggert,
 * dabei wird das beim show() übergebene INodeDroppedEvent emitiert.
 */
@Component({
  selector: 'app-files-inode-drop-menu',
  templateUrl: './files-inode-drop-menu.component.html',
  styleUrls: ['./files-inode-drop-menu.component.css'],
  standalone: false
})
export class FileDropINodeMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Output()
  copy: EventEmitter<INodeDroppedEvent> = new EventEmitter<INodeDroppedEvent>();

  @Output()
  move: EventEmitter<INodeDroppedEvent> = new EventEmitter<INodeDroppedEvent>();

  @Output()
  link: EventEmitter<INodeDroppedEvent> = new EventEmitter<INodeDroppedEvent>();

  triggerPosX: string = '';
  triggerPosY: string = '';

  private event: INodeDroppedEvent | null = null;

  /**
   * 
   * @param evt 
   */
  public show(evt: INodeDroppedEvent) {

    if (this.trigger) {
      this.triggerPosX = `${evt.dropEvt.clientX}px`;
      this.triggerPosY = `${evt.dropEvt.clientY}px`;
      this.event = evt;
      this.trigger.openMenu();
    }
  }

  onCopy() {
    this.copy.emit(this.event!);
  }

  onMove() {
    this.move.emit(this.event!);
  }

  onLink() {
    this.link.emit(this.event!);
  }

  /**
   * Move innerhalb des eigenen Parents ist blödsinn und wird disabled
   * @returns 
   */
  isMoveEnabled() {

    if(this.event?.sources) {

      for(let inode of this.event?.sources) {
        if(inode.parent === this.event?.target.uuid) {
          return false;
        }
      }
    }
    return true;
  }
}
