import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShapeFactoryService } from '../../services/shape-factory.service';
import { EDragMode } from '../../models/edrag-mode';

import { WhiteboardShapeContextMenuComponent } from '../whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';

import { AbstractShape } from '../../shapes/abstractshape';

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

  @ViewChild(WhiteboardShapeContextMenuComponent)
  ctxMenu!: WhiteboardShapeContextMenuComponent;

  selectedElement: SVGGraphicsElement | undefined = undefined;
  isInDrag: boolean = false;

  private dragMode: EDragMode = EDragMode.none;
  private resizeMode: string = '';
  private svgsToShapes: Map<SVGElement, AbstractShape> = new Map<SVGElement, AbstractShape>();
  private selectedShapes: Set<AbstractShape> = new Set<AbstractShape>();

  /**
   * Liefert das SVG-RootElement
   */
  public get svgRoot(): SVGSVGElement {

    return this.svg.nativeElement as unknown as SVGSVGElement;
  }

  /**
   * 
   * @param shapeFactory 
   */
  constructor(private shapeFactory: ShapeFactoryService) {

  }

  /**
   * Erzeuge ein Shape
   */
  public onCreateShape(type: string) {

    const shape = this.shapeFactory.createShape(this.svgRoot, type, 0, 0, 100, 100);
    shape.onMouseDown = this.onStartDragShape.bind(this);
    shape.onStartResize = this.onStartResizeShape.bind(this);
    this.svgsToShapes.set(shape.svgElem, shape);
  }

  /**
   * 
   * @param evt 
   * @param shape
   */
  onStartDragShape(evt: MouseEvent, shape: AbstractShape) {

    this.dragMode = EDragMode.dragShape;
    if (!evt.ctrlKey) {
      this.clearAllSelections();
    }

    if (shape) {
      this.addSelectedShape(shape);
    }
  }

  /**
   * 
   * Starte den Resize eines SHapes. Dies wird durch einen ButtonDown auf einen
   * ResizeAnchor ausgelöst. Der Rest bleibt hier zu tun :-)
   * 
   * @param evt 
   * @param shape 
   * @param resizeType 
   */
  onStartResizeShape(evt: MouseEvent, shape: AbstractShape, resizeType: string) {

    this.dragMode = EDragMode.dragResize;
    this.resizeMode = resizeType;

    if (!evt.ctrlKey) {
      this.clearAllSelections();
    }

    if (shape) {
      this.addSelectedShape(shape);
    }
  }

  /**
   * Auf das rootSVG wurde ein MouseDown ausgelöst.
   * 
   * Shapes, Connection und ResizeHandles fangen das mousedown selber ab 
   * und stoppen die EventPropagation. Wenn also ein MouseDown hier ankommt, 
   * dann kann es nur vom rootElement kommen.
   * 
   * @param evt 
   */
  onMouseDown(evt: MouseEvent) {
    this.clearAllSelections();
  }

  /**
   * 
   * @param evt 
   */
  onMouseMove(evt: MouseEvent) {

    const deltaX = evt.movementX;
    const deltaY = evt.movementY;

    switch (this.dragMode) {
      case EDragMode.dragShape:
        this.moveSelectedShapes(deltaX, deltaY);
        break;

      case EDragMode.dragResize:
        this.resizeSelectedShapes(deltaX, deltaY)
        break;

      case EDragMode.dragConnector:
        break;

      default:
        break;
    }
  }

  /**
   * 
   * @param evt 
   */
  onMouseUp(evt: MouseEvent) {
    this.dragMode = EDragMode.none;
  }

  /**
   * 
   * @param evt 
   */
  onMouseLeave(evt: MouseEvent) {
    this.dragMode = EDragMode.none;
  }

  /**
   *  
   * @param evt 
   */
  onShowContextMenu(evt: MouseEvent) {

    evt.preventDefault();

    const svg = evt.target as SVGElement;
    if (svg === this.svgRoot) {
    }
    else {

      if (!evt.ctrlKey) {
        this.clearAllSelections();
      }

      const shape = this.svgsToShapes.get(svg);
      if (shape) {
        this.addSelectedShape(shape);
        this.ctxMenu.show(evt);
      }
    }
  }

  /**
   * Verschiebe alle selektierten Shapes um die angegebenen Werte
   * 
   * @param movementX 
   * @param movementY 
   */
  private moveSelectedShapes(movementX: number, movementY: number) {

    this.selectedShapes.forEach(shape => {
      shape.translateBy(movementX, movementY); // 
    });
  }

  /**
   * 
   * @param resizeX 
   * @param resizeY 
   */
  private resizeSelectedShapes(resizeX: number, resizeY: number) {

    this.selectedShapes.forEach(shape => {

      switch (this.resizeMode) {
        case 'n':
          shape.translateBy(0, resizeY);
          shape.resizeBy(0, -resizeY);
          break;

        case 'ne':
          shape.translateBy(0, resizeY);
          shape.resizeBy(resizeX, -resizeY);
          break;

        case 'e':
          shape.resizeBy(resizeX, 0);
          break;

        case 'se':
          shape.resizeBy(resizeX, resizeY);
          break;

        case 's':
          shape.resizeBy(0, resizeY);
          break;

        case 'sw':
          shape.translateBy(resizeX, 0);
          shape.resizeBy(-resizeX, resizeY);
          break;

        case 'w':
          shape.translateBy(resizeX, 0);
          shape.resizeBy(-resizeX, 0);
          break;

        case 'nw':
          shape.translateBy(resizeX, resizeY);
          shape.resizeBy(-resizeX, -resizeY);
          break;
      }
    });
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about selection                                                     */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  private addSelectedShape(shape: AbstractShape) {

    shape.setSelected(true);
    this.selectedShapes.add(shape);
  }

  /**
   * 
   */
  private clearAllSelections() {

    this.selectedShapes.forEach(shape => {
      shape.setSelected(false);
    })
    this.selectedShapes.clear();
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about property changes                                              */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Füll-Farbe
   * 
   * @param color 
   */
  public onChangeFillColor(color: string) {

    this.selectedShapes.forEach(shape => {
      shape.setFillColor(color);
    })
  }

  /**
   * Rahmen-Farbe
   * 
   * @param color 
   */
  onChangeBorderColor(color: string) {

    this.selectedShapes.forEach(shape => {
      shape.setBorderColor(color);
    })
  }

  /**
   * 
   * @param width 
   */
  onChangeBorderWidth(width: number) {

    this.selectedShapes.forEach(shape => {
      shape.setBorderWidth(width);
    })
  }

  /**
   * 
   * @param width 
   */
  onChangeBorderStyle(style: string) {

    this.selectedShapes.forEach(shape => {
      shape.setBorderStyle(style);
    })
  }
}
