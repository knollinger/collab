import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { EZOrderMode } from '../../models/ezorder-mode';

@Component({
  selector: 'app-whiteboard-shape-context-menu',
  templateUrl: './whiteboard-shape-context-menu.component.html',
  styleUrls: ['./whiteboard-shape-context-menu.component.css']
})
export class WhiteboardShapeContextMenuComponent {

  colors = ['red', 'blue', 'green', 'white', 'black'];
  borders = ['solid', 'dotted', 'dashed'];
  borderSizes = [1, 2, 3, 4, 5];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;
  triggerPosX: string = '';
  triggerPosY: string = '';

  @Output()
  fillColorChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  borderColorChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  borderSizeChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  borderStyleChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  zOrderChanged: EventEmitter<EZOrderMode> = new EventEmitter<EZOrderMode>();

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

  /**
   * 
   * @param color 
   */
  onSetBackgroundColor(color: string) {
    this.fillColorChanged.next(color);
  }

  /**
   * 
   * @param color 
   */
  onSetBorderColor(color: string) {
    this.borderColorChanged.next(color);
  }

  /**
   * 
   */
  onSetBorderWidth(width: number) {
    this.borderSizeChanged.next(width);
  }

  /**
   *  
   */
  onSetBorderStyle(style: string) {
    this.borderStyleChanged.next(style);
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
    alert('ShapeCtxMenu::delete not yet implemented');
  }
}
