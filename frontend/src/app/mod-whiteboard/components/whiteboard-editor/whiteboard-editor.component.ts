import { AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';

import { EZOrderMode } from '../../models/ezorder-mode';

import { WhiteboardShapeContextMenuComponent } from '../whiteboard-shape-context-menu/whiteboard-shape-context-menu.component';
import { WhiteboardExportService } from '../../services/whiteboard-export.service';
import { WhiteboardModel } from '../../models/whiteboard-model';
import { AbstractShape } from '../../drawables/shapes/abstractshape';
import { RectShape } from '../../drawables/shapes/rect-shape';
import { EllipsisShape } from '../../drawables/shapes/ellipsis-shape';
import { RombusShape } from '../../drawables/shapes/rombus-shape';
import { WhiteboardPersistenceService } from '../../services/whiteboard-persistence.service';
import { SelectorFrameGlassPane } from '../../glass-panes/selector-frame-glasspane';
import { DragShapesGlassPane } from '../../glass-panes/drag-shape-glasspane';
import { ResizeShapesGlassPane } from '../../glass-panes/resize-shape-glasspane';
import { DrawLineGlassPane } from '../../glass-panes/draw-line-glasspane';
import { PolygoneShape } from '../../drawables/shapes/polygone-shape';
import { DrawPolygoneGlassPane } from '../../glass-panes/draw-polygon-glasspane';
import { AbstractGlassPane } from '../../glass-panes/abstract-glasspane';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateShapeGlassPane } from '../../glass-panes/create-shape-glasspane';

@Component({
  selector: 'app-whiteboard-editor',
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css']
})
export class WhiteboardEditorComponent implements AfterViewInit {

  private destroyRef = inject(DestroyRef);

  private uuid: string | null = null;

  @ViewChild("svg")
  svgElem!: ElementRef<SVGSVGElement>;

  @ViewChild("svgScroller")
  scroller!: ElementRef<HTMLDivElement>;

  @ViewChild(WhiteboardShapeContextMenuComponent)
  shapeCtxMenu!: WhiteboardShapeContextMenuComponent;

  showShapesMenu: boolean = false;
  model: WhiteboardModel = WhiteboardModel.empty();

  /**
   * 
   */
  constructor(
    private currRoute: ActivatedRoute,
    private commonsDlgs: CommonDialogsService,
    private persistenceSvc: WhiteboardPersistenceService,
    private exportSvc: WhiteboardExportService,
    private snackBar: MatSnackBar) {

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
                this.bindShapeEventHandlers(shape);
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
  public onCreateSimpleShape(type: string) {

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

      case 'polygon':
        shape = new PolygoneShape(this.model.svgRoot);
        break;

      default:
        throw new Error(`unknown shape type '${type}`);
    }

    shape.width = shape.height = 0;
    this.model.addShape(shape);
    this.bindShapeEventHandlers(shape);
    this.showGlassPane(new CreateShapeGlassPane(this.model, shape));
  }

  public onCreatePolygoneShape() {

    const shape = new PolygoneShape(this.model.svgRoot);
    this.model.addShape(shape);
    this.bindShapeEventHandlers(shape);
    this.showGlassPane(new DrawPolygoneGlassPane(this.model.svgRoot, shape));
  }

  /**
   * 
   * @param shape 
   */
  private bindShapeEventHandlers(shape: AbstractShape) {

    shape.onShapeChanged = this.onShapeChanged.bind(this);
    shape.onClick = this.onShapeClick.bind(this);
    shape.onStartDrag = this.onStartDragShape.bind(this);
    shape.onStartResize = this.onStartResizeShape.bind(this);
    shape.onShowCtxMenu = this.onShowShapesContextMenu.bind(this);
  }

  /**
   * Erzeuge ein Shape
   */
  public onCreatePolyLineLine() {

    const line = this.model.createPolyLine();
    this.showGlassPane(new DrawLineGlassPane(this.model.svgRoot, line));
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

      if (!evt.ctrlKey) {
        this.model.deselectAll();
      }

      if (shape) {
        this.model.selectShape(shape);
      }
      this.showGlassPane(new DragShapesGlassPane(this.model));
    }
  }

  /**
   * 
   * Starte den Resize eines SHapes. Dies wird durch einen ButtonDown auf einen
   * ResizeAnchor ausgelöst.
   * 
   * @param evt 
   * @param shape 
   * @param resizeType 
   */
  onStartResizeShape(evt: MouseEvent, shape: AbstractShape, resizeType: string) {

    if (!evt.ctrlKey) {
      this.model.deselectAll();
    }
    this.addSelectedShape(shape);
    this.showGlassPane(new ResizeShapesGlassPane(this.model, resizeType));
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
      this.showGlassPane(new SelectorFrameGlassPane(this.model, evt.offsetX, evt.offsetY));
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

  /**
   * 
   * @param glassPane 
   */
  private showGlassPane(glassPane: AbstractGlassPane) {

    const hintText = glassPane.hintText;
    if (hintText) {
      this.commonsDlgs.showSnackbar(hintText);
    }
  }
}
