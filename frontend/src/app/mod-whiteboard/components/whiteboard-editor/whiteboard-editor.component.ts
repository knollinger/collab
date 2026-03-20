import { Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';

import { ShapeFactoryService } from '../../services/shape-factory.service';
import { EDragMode } from '../../models/edrag-mode';

import { AbstractShape } from '../../shapes/abstractshape';
import { EZOrderMode } from '../../models/ezorder-mode';
import { WhiteboardShapeContextMenuComponent } from '../whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { FilesPickerService } from '../../../mod-files/mod-files.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-whiteboard-editor',
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css']
})
export class WhiteboardEditorComponent implements OnInit, OnDestroy {

  private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  private destroyRef: DestroyRef = inject(DestroyRef);

  @ViewChild("svg")
  svg!: ElementRef<HTMLElement>;
  imgWidth: string = '100%';
  imgHeight: string = '100%';

  @ViewChild(WhiteboardShapeContextMenuComponent)
  shapeCtxMenu!: WhiteboardShapeContextMenuComponent;

  private _dragMode: EDragMode = EDragMode.none;
  private _resizeMode: string = '';
  private _shapes: Array<AbstractShape> = new Array<AbstractShape>();
  private _connector: SVGLineElement | null = null;
  private _selectorFrame: SVGRectElement | null = null;
  public selectedShapes: Array<AbstractShape> = new Array<AbstractShape>();

  showShapesMenu: boolean = false;
  showConnectorsMenu: boolean = false;
  private _resizeCallback: any = null;
  private _gridGroup: SVGGElement | null = null;

  /**
   * 
   * @param shapeFactory 
   */
  constructor(
    private shapeFactory: ShapeFactoryService,
    private commonsDlgs: CommonDialogsService,
    private filePicker: FilesPickerService) {

  }

  /**
   * 
   */
  ngOnInit() {

    this._resizeCallback = this.onSVGResize.bind(this);
    window.addEventListener('resize', this._resizeCallback);
  }

  /**
   * 
  */
  ngOnDestroy(): void {

    window.removeEventListener('resize', this._resizeCallback);
  }

  /**
   * Liefert das SVG-RootElement
   */
  public get svgRoot(): SVGSVGElement {

    return this.svg.nativeElement as unknown as SVGSVGElement;
  }

  /**
   * 
   * @param evt 
   */
  public onSVGResize(evt: Event) {

    if (this.showGridLines) {
      this.removeGridLines();
      this.createGridLines();
    }
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

    const width = this.svgRoot.clientWidth;
    const height = this.svgRoot.clientHeight;
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
    this.svgRoot.insertBefore(this._gridGroup, this.svgRoot.firstChild);
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
  onSVGDownload() {

    this.commonsDlgs.showInputBox('Speichern unter', 'Datei-Name').subscribe(name => {

      const blob = new Blob([this.svgRoot.outerHTML], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  /**
   * Erzeuge ein Shape
   */
  public onCreateShape(type: string) {

    const shape = this.shapeFactory.createShape(this.svgRoot, type, 0, 0, 100, 100);
    shape.onStartDrag = this.onStartDragShape.bind(this);
    shape.onStartResize = this.onStartResizeShape.bind(this);
    shape.onStartConnect = this.onStartConnect.bind(this);
    shape.onShowCtxMenu = this.onShowShapesContextMenu.bind(this);
    this._shapes.push(shape);
  }

  public onShowFilePicker() {

    this.filePicker.showFilePicker(true, new RegExp('image/.*', 'i'))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {
        if (inodes) {
          alert('inodes: ' +  inodes);
        }
      });

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
        this.clearAllSelections();
      }

      if (shape) {
        this.addSelectedShape(shape);
      }
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

    this._dragMode = EDragMode.dragResize;
    this._resizeMode = resizeType;

    if (!evt.ctrlKey) {
      this.clearAllSelections();
    }

    if (shape) {
      this.addSelectedShape(shape);
    }
  }

  /**
   * 
   * @param evt 
   * @param shape 
   * @param position 
   */
  onStartConnect(evt: MouseEvent, shape: AbstractShape, position: string) {

    if (!this._connector) {

      this._dragMode = EDragMode.dragConnector;
      this._connector = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, 'line') as SVGLineElement;
      this._connector.setAttribute('x1', `${evt.offsetX}`);
      this._connector.setAttribute('y1', `${evt.offsetY}`);
      this._connector.setAttribute('x2', `${evt.offsetX}`);
      this._connector.setAttribute('y2', `${evt.offsetY}`);
      this._connector.setAttribute('stroke', 'black');
      this._connector.setAttribute('stroke-width', '1');

      this.svgRoot.appendChild(this._connector);

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
    if (evt.target === this.svgRoot && evt.button === 0) {
      this.startFrameSelection(evt);
    }
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
        this.moveSelectedShapes(deltaX, deltaY);
        break;

      case EDragMode.dragResize:
        this.resizeSelectedShapes(deltaX, deltaY)
        break;

      case EDragMode.dragConnector:

        console.log('move connector');
        this._connector!.setAttribute('x2', `${evt.offsetX}`);
        this._connector!.setAttribute('y2', `${evt.offsetY}`);

        console.log(this._connector!);
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

      case EDragMode.dragConnector:
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

    let selection = Array.of(shape);
    shape.setSelected(true);

    if (!evt.ctrlKey) {
      this.clearAllSelections();
    }
    else {
      selection = selection.concat(this.selectedShapes);
    }
    this.selectedShapes = selection;
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
      this.svgRoot.appendChild(this._selectorFrame);
      this._dragMode = EDragMode.dragSelectorFrame;
    }
  }

  /**
   * 
   * @param evt 
   */
  private resizeSelectorFrame(evt: MouseEvent) {

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

      this.selectByFrame(newX, newY, width, height);
    }
  }

  private selectByFrame(x: number, y: number, width: number, height: number) {

    this.clearAllSelections();
    const selected: Array<AbstractShape> = new Array<AbstractShape>();
    this._shapes.forEach((shape) => {

      if (shape.isInRect(x, y, width, height)) {
        shape.setSelected(true);
        selected.push(shape);
      }
      this.selectedShapes = selected;
    });
  }


  private stopFrameSelection() {

    if (this._selectorFrame) {
      this._selectorFrame.remove();
      this._selectorFrame = null;
      this._dragMode = EDragMode.none;
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

      switch (this._resizeMode) {
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

  /**
   * Lösche alle Selektierten Shapes
   */
  public onDeleteSelectedShapes() {

    this.selectedShapes.forEach(shape => {
      shape.delete();
    })

    this._shapes = this._shapes.filter(shape => {
      return this.selectedShapes.indexOf(shape) !== -1;
    })

    this.selectedShapes = new Array<AbstractShape>();
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
    const selected: Array<AbstractShape> = new Array<AbstractShape>(...this.selectedShapes);
    selected.push(shape);
    this.selectedShapes = selected;
  }

  public selectAll() {

    const selected = new Array<AbstractShape>();
    this._shapes.forEach(shape => {
      shape.setSelected(true);
      selected.push(shape);
    })
    this.selectedShapes = selected;
  }

  /**
   * 
   */
  public clearAllSelections() {

    this.selectedShapes.forEach(shape => {
      shape.setSelected(false);
    })
    this.selectedShapes = new Array<AbstractShape>();
  }

  public get hasSelection(): boolean {
    return this.selectedShapes.length !== 0;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about property changes                                              */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  onChangeZOrder(zorder: EZOrderMode) {

    this.selectedShapes.forEach(shape => {

      switch (zorder) {
        case EZOrderMode.background:
          shape.changeZOrderBackground();
          break;

        case EZOrderMode.back:
          shape.changeZOrderBack();
          break;

        case EZOrderMode.fore:
          shape.changeZOrderFore();
          break;

        case EZOrderMode.foreground:
          shape.changeZOrderForeground();
          break;
      }
    })
  }
}
