import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-whiteboard-root-context-menu',
  templateUrl: './whiteboard-root-context-menu.component.html',
  styleUrls: ['./whiteboard-root-context-menu.component.css']
})
export class WhiteboardRootContextMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;
  triggerPosX: string = '';
  triggerPosY: string = '';

  @Output()
  selectAll: EventEmitter<void> = new EventEmitter<void>();

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

  onSelectAll() {
    this.selectAll.next();
  }
}
