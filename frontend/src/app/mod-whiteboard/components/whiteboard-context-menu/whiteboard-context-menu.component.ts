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
  zOrderChange: EventEmitter<ChangeZOrder> = new EventEmitter<ChangeZOrder>();

  colors = ['red', 'blue', 'green', 'white', 'black'];
  borders = ['solid', 'dotted', 'dashed'];
  borderSizes = [1, 2, 3, 4, 5];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;
  triggerPosX: string = '';
  triggerPosY: string = '';

  svgElement: SVGGraphicsElement | undefined = undefined;

  /**
   * 
   * @param evt 
   */
  show(evt: MouseEvent, elem: SVGGraphicsElement) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.trigger) {

      this.svgElement = elem;
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

    if (this.svgElement) {
      this.svgElement.setAttribute('fill', color);
    }

  }

  /**
   * 
   * @param color 
   */
  onSetBorderColor(color: string) {

    if (this.svgElement) {
      this.svgElement.setAttribute('stroke', color);
    }
  }

  /**
   * 
   */
  onSetBorderStyle(style: string) {

    if (this.svgElement) {

      const width = Number.parseInt(this.svgElement.getAttribute('stroke-width') || '1');

      switch (style) {
        case 'solid':
          this.svgElement.removeAttribute('stroke-dasharray');
          break;

        case 'dotted':
          this.svgElement.setAttribute('stroke-dasharray', `${width} ${width}`);
          break;

        case 'dashed':
          this.svgElement.setAttribute('stroke-dasharray', '8 8');
          break;
      }
    }
  }

  /**
   * 
   */
  onSetBorderWidth(width: number) {

    if (this.svgElement) {
      this.svgElement.setAttribute('stroke-width', width.toString());
    }
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
