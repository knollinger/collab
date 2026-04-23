import { AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';

import { EDragMode } from '../../models/edrag-mode';
import { EZOrderMode } from '../../models/ezorder-mode';

import { WhiteboardShapeContextMenuComponent } from '../whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { WhiteboardExportService } from '../../services/whiteboard-export.service';
import { WhiteboardModel } from '../../models/whiteboard-model';
import { AbstractShape } from '../../drawables/shapes/abstractshape';
import { RectShape } from '../../drawables/shapes/rect-shape';
import { EllipsisShape } from '../../drawables/shapes/ellipsis-shape';
import { RombusShape } from '../../drawables/shapes/rombus-shape';
import { WhiteboardPersistenceService } from '../../services/whiteboard-persistence.service';

@Component({
  selector: 'app-whiteboard-editor',
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css']
})
export class WhiteboardEditorComponent implements AfterViewInit {

  private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  private destroyRef = inject(DestroyRef);

  private uuid: string | null = null;

  @ViewChild("svg")
  svgElem!: ElementRef<SVGSVGElement>;

  @ViewChild("svgScroller")
  scroller!: ElementRef<HTMLDivElement>;

  @ViewChild(WhiteboardShapeContextMenuComponent)
  shapeCtxMenu!: WhiteboardShapeContextMenuComponent;

  private _dragMode: EDragMode = EDragMode.none;
  private _resizeMode: string = '';

  private _selectorFrameGlasspane: SVGRectElement | null = null;
  private _selectorFrame: SVGRectElement | null = null;

  showShapesMenu: boolean = false;

  model: WhiteboardModel = WhiteboardModel.empty();

  /**
   * 
   */
  constructor(
    private currRoute: ActivatedRoute,
    private commonsDlgs: CommonDialogsService,
    private persistenceSvc: WhiteboardPersistenceService,
    private exportSvc: WhiteboardExportService) {

  }

  /**
   * Binde das aktuelle SVG an das Whiteboard-Model
   */
  ngAfterViewInit() {

    this.currRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        this.uuid = params.get('uuid');
        if (!this.uuid) {
          this.model = new WhiteboardModel(this.svgRoot);
        }
        else {
          this.persistenceSvc.loadModel(this.uuid, this.svgRoot)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(model => {
              this.model = model;
              this.model.shapes.forEach(shape => {
                this.bindEventHandlers(shape);
              })
              this.deselectAll();
            });
        }
      })
  }

  /**
   * 
   */
  get svgRoot(): SVGSVGElement {
    return this.svgElem.nativeElement;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All image dimensions                                                    */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  get imgWidth(): string {
    return `${this.model.width}px`;
  }

  /**
   * 
   */
  get imgHeight(): string {
    return `${this.model.height}px`;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about grid lines                                                    */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  set showGridLines(val: boolean) {

    this.model.showGridLines = val;
  }

  onSave() {

    console.log('save model');
    if (this.uuid) {
      this.persistenceSvc.saveModel(this.uuid, this.model)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(inode => {
          console.log(inode);
        });
    }
    else {
      alert('save new doc not yet implemented');
    }
  }

  /**
   * 
   */
  onExport() {

    this.commonsDlgs.showInputBox('Speichern unter', 'Datei-Name').subscribe(name => {
      if (name) {

        this.deselectAll();
        this.showGridLines = false;
        this.exportSvc.exportImage(name, this.model);
      }
    });
  }

  /**
   * Erzeuge ein Shape
   */
  public onCreateShape(type: string) {

    let shape: AbstractShape;
    switch (type) {
      case 'rect':
        shape = new RectShape(this.model.svgRoot);
        break;

      case 'ellipse':
        shape = new EllipsisShape(this.model.svgRoot);
        break;

      case 'rombus':
        shape = new RombusShape(this.model.svgRoot);
        break;

      default:
        throw new Error(`unknown shape type '${type}`);
        break;
    }

    this.model.addShape(shape);
    this.bindEventHandlers(shape);

    shape.posX = shape.posY = 30;
    shape.width = shape.height = 100;
  }

  private bindEventHandlers(shape: AbstractShape) {

    shape.onShapeChanged = this.onShapeChanged.bind(this);
    shape.onClick = this.onShapeClick.bind(this);
    shape.onStartDrag = this.onStartDragShape.bind(this);
    shape.onStartResize = this.onStartResizeShape.bind(this);
    shape.onShowCtxMenu = this.onShowShapesContextMenu.bind(this);
  }

  /**
   * Erzeuge ein Shape
   */
  public onCreateLine(type: string) {

    const line = this.model.createLine(type);
  }

  onShapeChanged(shape: AbstractShape) {
    this.model.normalizeImageDimensions();
  }

  /**
   * 
   * @param evt 
   * @param shape 
   */
  onShapeClick(evt: MouseEvent, shape: AbstractShape) {

    if (!evt.ctrlKey) {
      this.model.deselectAll();
    }
    this.model.selectShape(shape);
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

    if (evt.button === 0) {
      evt.stopPropagation();
      evt.preventDefault();

      this.model.deselectAll();
      this.startFrameSelection(evt);
    }
  }

  /**
   * 
   * @param evt 
   */
  onMouseMove(evt: MouseEvent) {

    if (evt.button === 0) {

      evt.stopPropagation();
      evt.preventDefault();

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
  }

  /**
   * 
   * @param evt 
   */
  onMouseUp(evt: MouseEvent) {

    if (evt.button === 0) {
      evt.stopPropagation();
      evt.preventDefault();

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
  }

  /**
   * 
   * @param evt 
   */
  onMouseLeave(evt: MouseEvent) {
    if (this._dragMode !== EDragMode.dragSelectorFrame) {
      this._dragMode = EDragMode.none;
    }
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

    if (!this._selectorFrameGlasspane) {

      this._selectorFrameGlasspane = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, 'rect') as SVGRectElement;
      this._selectorFrameGlasspane.setAttribute('x', '0');
      this._selectorFrameGlasspane.setAttribute('y', '0');
      this._selectorFrameGlasspane.setAttribute('width', '100%');
      this._selectorFrameGlasspane.setAttribute('height', '100%');
      this._selectorFrameGlasspane.setAttribute('class', 'selector-frame-glasspane');
      this.model.svgRoot.appendChild(this._selectorFrameGlasspane);

      this._selectorFrame = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, 'rect') as SVGRectElement;
      this._selectorFrame.setAttribute('x', `${evt.offsetX}`);
      this._selectorFrame.setAttribute('y', `${evt.offsetY}`);
      this._selectorFrame.setAttribute('class', 'selector-frame');
      this.model.svgRoot.appendChild(this._selectorFrame);


      this.model.deselectAll();
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

      this.model.selectByFrame(newX, newY, width, height);
    }
  }


  private stopFrameSelection() {

    if (this._selectorFrameGlasspane) {
      this._selectorFrameGlasspane.remove();
      this._selectorFrameGlasspane = null;
    }
    if (this._selectorFrame) {
      this._selectorFrame.remove();
      this._selectorFrame = null;
    }
    this._dragMode = EDragMode.none;

  }

  /**
   * Lösche alle selektierten Shapes
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
