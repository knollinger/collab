import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChangeZOrder, WhiteboardContextMenuComponent } from '../whiteboard-context-menu/whiteboard-context-menu.component';

import { RectShape } from '../../shapes/rect-shape';
import { RombusShape } from '../../shapes/rombus-shape';
import { EllipsisShape } from '../../shapes/ellipsis-shape';

@Component({
  selector: 'app-whiteboard-editor',
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css']
})
export class WhiteboardEditorComponent {

  private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  private static DEFAULT_SHAPE_WIDTH = 100;
  private static DEFAULT_SHAPE_HEIGHT = 100;

  @ViewChild("svg")
  svg!: ElementRef<HTMLElement>;

  @ViewChild(WhiteboardContextMenuComponent)
  ctxMenu!: WhiteboardContextMenuComponent;

  selectedElement: SVGGraphicsElement | undefined = undefined;
  isInDrag: boolean = false;

  /**
   * Liefert das SVG-RootElement
   */
  public get svgRoot(): SVGSVGElement {

    return this.svg.nativeElement as unknown as SVGSVGElement;
  }


  /**
   * Erzeuge ein Rectangle
   */
  onCreateRectangle() {
    console.log(this.ctxMenu);
    new RectShape(this.svgRoot, 100, 100);
  }

  /**
   * Erzeuge einen Rombus
   */
  onCreateRombus() {
    new RombusShape(this.svgRoot, 100, 100);
  }


  /**
   * Erzeuge einen Kreis/Ellipse
   */
  onCreateEllipsis() {
    new EllipsisShape(this.svgRoot, 100, 100);
  }

  /**
   * 
   * @param event 
   */
  onShowContextMenu(event: MouseEvent) {
    const elem = event.target as SVGGraphicsElement;
    this.ctxMenu.show(event, elem); // AbstractShape übergeben!
  }

  /**
   * Ändere die zOrder des selektierten Elements
   * 
   * @param delta ein enumValue vom Typ ChangeZOrder
   */
  onChangeZOrder(delta: ChangeZOrder) {

    if (this.selectedElement) {

      const group = this.selectedElement.parentElement;
      if (group) {

        switch (delta) {
          case ChangeZOrder.background:
            this.svgRoot.insertBefore(group, this.svgRoot.firstChild);
            break;

          case ChangeZOrder.back:
            this.svgRoot.insertBefore(group, group.previousSibling);
            break;

          case ChangeZOrder.fore:
            if (group.nextSibling) {
              this.svgRoot.insertBefore(group.nextSibling, group);
            }
            else {
              this.svgRoot.appendChild(group);
            }
            break;

          case ChangeZOrder.foreground:
            this.svgRoot.appendChild(group);
            break;
        }
      }
    }
  }
}
