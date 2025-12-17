import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

export enum ChangeZOrder {
  background,
  back,
  fore,
  foreground
}

@Component({
  selector: 'app-whiteboard-context-menu',
  templateUrl: './whiteboard-context-menu.component.html',
  styleUrls: ['./whiteboard-context-menu.component.css']
})
export class WhiteboardContextMenuComponent {

  @Output()
  backgroundColorChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  borderColorChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  borderStyleChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  borderWidthChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  zOrderChange: EventEmitter<ChangeZOrder> = new EventEmitter<ChangeZOrder>();

  colors = ['red', 'blue', 'green', 'white', 'black', 'transparent'];
  borders = ['solid', 'dotted', 'dashed'];
  borderSizes = [1, 2, 3, 4, 5];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;
  triggerPosX: string = '';
  triggerPosY: string = '';

  /**
   * 
   * @param evt 
   */
  show(evt: MouseEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.trigger) {

      console.log(evt.target);
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

    this.backgroundColorChanged.next(color);
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
  onSetBorderStyle(style: string) {

    this.borderStyleChanged.next(style);
  }

  /**
   * 
   */
  onSetBorderWidth(width: number) {

    this.borderWidthChanged.next(width);
  }

  onMoveToBackground() {
    this.zOrderChange.next(ChangeZOrder.background);
  }

  onMoveBack() {
    this.zOrderChange.next(ChangeZOrder.back);
  }

  onMoveFore() {
    this.zOrderChange.next(ChangeZOrder.fore);
  }

  onMoveToForeground() {
    this.zOrderChange.next(ChangeZOrder.foreground);
  }
}
