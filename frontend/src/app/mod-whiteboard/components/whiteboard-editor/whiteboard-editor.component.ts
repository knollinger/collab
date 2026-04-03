import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';

import { EDragMode } from '../../models/edrag-mode';

import { EZOrderMode } from '../../models/ezorder-mode';
import { WhiteboardShapeContextMenuComponent } from '../whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { WhiteboardExportService } from '../../services/whiteboard-export.service';
import { WhiteboardDocument } from '../../models/whiteboard-document';
import { AbstractShape } from '../../drawables/shapes/abstractshape';

@Component({
  selector: 'app-whiteboard-editor',
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css']
})
export class WhiteboardEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  private destroyRef: DestroyRef = inject(DestroyRef);

  @ViewChild("svg")
  svg!: ElementRef<SVGSVGElement>;

  @ViewChild("svgScroller")
  scroller!: ElementRef<HTMLDivElement>;

  @ViewChild(WhiteboardShapeContextMenuComponent)
  shapeCtxMenu!: WhiteboardShapeContextMenuComponent;

  private _dragMode: EDragMode = EDragMode.none;
  private _resizeMode: string = '';
  private _selectorFrame: SVGRectElement | null = null;

  showShapesMenu: boolean = false;
  showConnectorsMenu: boolean = false;
  private _resizeCallback: any = null;
  private _gridGroup: SVGGElement | null = null;

  model: WhiteboardDocument = WhiteboardDocument.empty();

  /**
   * 
   * @param shapeFactory 
   */
  constructor(
    private commonsDlgs: CommonDialogsService,
    private exportSvc: WhiteboardExportService) {

  }

  /**
   * 
   */
  ngOnInit() {

    this._resizeCallback = this.onResize.bind(this);
    window.addEventListener('resize', this._resizeCallback);

  }

  /**
   * Binde das aktuelle SVG an das Whiteboard-Model
   */
  ngAfterViewInit() {

    this.model = new WhiteboardDocument(this.svg.nativeElement);
  }

  /**
   * 
  */
  ngOnDestroy(): void {

    window.removeEventListener('resize', this._resizeCallback);
  }

  /**
   * 
   * @param evt 
   */
  private onResize(evt: Event) {

    if (this.showGridLines) {
      this.removeGridLines();
      this.createGridLines();
    }
  }

  private _scrollX: number = 0;
  private _scrollY: number = 0;
  
  onScroll(evt: Event) {
    const x = evt.target as HTMLElement;
    this._scrollX = x.scrollLeft;
    this._scrollY = x.scrollLeft;
  }

  get imgWidth(): string {
    return `${this.model.width}px`;
  }

  get imgHeight(): string {
    return `${this.model.height}px`;
  }

  /**
   * 
   */
  set showGridLines(val: boolean) {

    if (this._gridGroup) {
      this.removeGridLines();
    }
    else {
      this.createGridLines();
    }
  }

  /**
   * 
   */
  private removeGridLines() {

    if (this._gridGroup) {
      this._gridGroup.remove();
      this._gridGroup = null;
    }
  }

  /**
   * 
   */
  private createGridLines() {

    this._gridGroup = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, "g") as SVGGElement;

    const svg = this.svg.nativeElement;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    for (let i = 0; i < width; i += 32) {

      const elem = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, 'line') as SVGGraphicsElement;
      elem.setAttribute('x1', `${i}`);
      elem.setAttribute('y1', `0`);
      elem.setAttribute('x2', `${i}`);
      elem.setAttribute('y2', `${height}`);
      elem.setAttribute('stroke-dasharray', `2 6`);
      elem.setAttribute('stroke', `lightgray`);
      this._gridGroup.appendChild(elem);
    }

    for (let i = 0; i < height; i += 32) {

      const elem = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, 'line') as SVGGraphicsElement;
      elem.setAttribute('x1', `${0}`);
      elem.setAttribute('y1', `${i}`);
      elem.setAttribute('x2', `${width}`);
      elem.setAttribute('y2', `${i}`);
      elem.setAttribute('stroke-dasharray', `2 6`);
      elem.setAttribute('stroke', `lightgray`);
      this._gridGroup.appendChild(elem);
    }
    svg.insertBefore(this._gridGroup, svg.firstChild);
  }

  /**
   * 
   */
  get showGridLines(): boolean {
    return this._gridGroup != null;
  }

  /**
   * 
   */
  onExport() {

    this.commonsDlgs.showInputBox('Speichern unter', 'Datei-Name').subscribe(name => {
      if (name) {

        this.deselectAll();
        this.showGridLines = false;
        this.exportSvc.exportImage(name, this.model.svgRoot);
      }
    });
  }

  /**
   * Erzeuge ein Shape
   */
  public onCreateShape(type: string) {


    const shape = this.model.createShape(type);
    shape.onStartDrag = this.onStartDragShape.bind(this);
    shape.onStartResize = this.onStartResizeShape.bind(this);
    shape.onShowCtxMenu = this.onShowShapesContextMenu.bind(this);

    shape.posX = this.scroller.nativeElement.clientWidth / 2 + this._scrollX - shape.width / 2; // TODO: stimmt so nicht
    shape.posY = this.scroller.nativeElement.clientHeight / 2 + this._scrollY - shape.height / 2;
    // this.model.normalizeImageDimensions();
  }

  /**
   * Erzeuge ein Shape
   */
  public onCreateLine(type: string) {

    const line = this.model.createLine(type);
    // shape.onStartDrag = this.onStartDragShape.bind(this);
    // shape.onStartResize = this.onStartResizeShape.bind(this);
    // shape.onShowCtxMenu = this.onShowShapesContextMenu.bind(this);
  }

  /**
   * 
   * @param evt 
   * @param shape
   */
  onStartDragShape(evt: MouseEvent, shape: AbstractShape) {

    if (evt.button === 0) {

      this._dragMode = EDragMode.dragShape;
      if (!evt.ctrlKey) {
        this.model.deselectAll();
      }

      if (shape) {
        this.model.selectShape(shape);
      }
    }
  }

  /**
   * 
   * Starte den Resize eines SHapes. Dies wird durch einen ButtonDown auf einen
   * ResizeAnchor ausgelöst. Der Rest wird im mouseMove erledigt
   * 
   * @param evt 
   * @param shape 
   * @param resizeType 
   */
  onStartResizeShape(evt: MouseEvent, shape: AbstractShape, resizeType: string) {

    this._dragMode = EDragMode.dragResize;
    this._resizeMode = resizeType;

    if (!evt.ctrlKey) {
      this.model.deselectAll();
    }
    this.addSelectedShape(shape);
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

    this.model.deselectAll();
    this.startFrameSelection(evt);
  }

  /**
   * 
   * @param evt 
   */
  onMouseMove(evt: MouseEvent) {

    const deltaX = evt.movementX;
    const deltaY = evt.movementY;

    switch (this._dragMode) {
      case EDragMode.dragShape:
        this.model.moveSelectedShapes(deltaX, deltaY);
        break;

      case EDragMode.dragResize:
        this.model.resizeSelectedShapes(this._resizeMode, deltaX, deltaY)
        break;

      case EDragMode.dragSelectorFrame:
        this.resizeSelectorFrame(evt);
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

    switch (this._dragMode) {
      case EDragMode.dragShape:
        break;

      case EDragMode.dragResize:
        break;

      case EDragMode.dragSelectorFrame:
        this.stopFrameSelection();
        break;

      default:
        break;
    }
    this._dragMode = EDragMode.none;
  }

  /**
   * 
   * @param evt 
   */
  onMouseLeave(evt: MouseEvent) {
    this._dragMode = EDragMode.none;
  }

  /**
   * 
   * @param evt 
   */
  onShowShapesContextMenu(evt: MouseEvent, shape: AbstractShape) {

    if (!evt.ctrlKey) {
      this.model.deselectAll();
    }
    this.model.selectShape(shape);
    this.shapeCtxMenu.show(evt);
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* all about frame selection                                               */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  private startFrameSelection(evt: MouseEvent) {

    if (!this._selectorFrame) {

      this._selectorFrame = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, 'rect') as SVGRectElement;
      this._selectorFrame.setAttribute('x', `${evt.offsetX}`);
      this._selectorFrame.setAttribute('y', `${evt.offsetY}`);
      this._selectorFrame.setAttribute('class', 'selector-frame');
      this.model.svgRoot.appendChild(this._selectorFrame);
      this._dragMode = EDragMode.dragSelectorFrame;
    }
  }

  /**
   * 
   * @param evt 
   */
  private resizeSelectorFrame(evt: MouseEvent) {

    evt.stopPropagation();

    if (this._selectorFrame) {

      const currX = Number.parseInt(this._selectorFrame.getAttribute('x')!);
      const currY = Number.parseInt(this._selectorFrame.getAttribute('y')!);

      let newX = currX;
      let width = evt.offsetX - currX;
      if (evt.offsetX < currX) {
        newX = evt.offsetX;
        width = currX - evt.offsetX;
      }

      let newY = currY;
      let height = evt.offsetY - currY;
      if (evt.offsetY < currY) {
        newY = evt.offsetY;
        height = currY - evt.offsetY;
      }

      this._selectorFrame.setAttribute('x', `${newX}`);
      this._selectorFrame.setAttribute('y', `${newY}`);
      this._selectorFrame.setAttribute('width', `${width}`);
      this._selectorFrame.setAttribute('height', `${height}`);

      this.model.selectByFrame(newX, newY, width, height);
    }
  }


  private stopFrameSelection() {

    if (this._selectorFrame) {
      this._selectorFrame.remove();
      this._selectorFrame = null;
      this._dragMode = EDragMode.none;
    }
  }


  /**
   * Lösche alle Selektierten Shapes
   */
  public onDeleteSelectedShapes() {
    this.model.deleteSelectedShapes();
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
    this.model.selectShape(shape);
  }

  public selectAll() {
    this.model.selectAll();
  }

  /**
   * 
   */
  public deselectAll() {
    this.model.deselectAll();
  }

  /**
   * 
   */
  public get hasSelection(): boolean {
    return this.model.hasSelection();
  }

  public get selectedShapes(): Set<AbstractShape> {

    // TODO: Das clonen sollte ins Model verlegt werden. nur wenn nötig
    return new Set<AbstractShape>(this.model.selectedShapes);
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about property changes                                              */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  onChangeZOrder(zorder: EZOrderMode) {
    this.model.changeSelectedShapesZOrder(zorder);
  }
}
