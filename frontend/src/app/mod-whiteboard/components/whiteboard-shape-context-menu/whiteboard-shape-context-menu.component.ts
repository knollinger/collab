import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { EZOrderMode } from '../../models/ezorder-mode';

@Component({
  selector: 'app-whiteboard-shape-context-menu',
  templateUrl: './whiteboard-shape-context-menu.component.html',
  styleUrls: ['./whiteboard-shape-context-menu.component.css']
})
export class WhiteboardShapeContextMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;
  triggerPosX: string = '';
  triggerPosY: string = '';

  @Output()
  zOrderChanged: EventEmitter<EZOrderMode> = new EventEmitter<EZOrderMode>();

  @Output()
  delete: EventEmitter<void> = new EventEmitter<void>();

  /**
   * 
   * @param evt 
   */
  show(evt: MouseEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.trigger) {

      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;

      this.trigger.openMenu();
    }
  }

  onMoveToBackground() {
    this.zOrderChanged.next(EZOrderMode.background);
  }

  onMoveBack() {
    this.zOrderChanged.next(EZOrderMode.back);
  }

  onMoveFore() {
     this.zOrderChanged.next(EZOrderMode.fore);
 }

  onMoveToForeground() {
    this.zOrderChanged.next(EZOrderMode.foreground);
  }

  onDelete() {
    this.delete.next();
  }
}
