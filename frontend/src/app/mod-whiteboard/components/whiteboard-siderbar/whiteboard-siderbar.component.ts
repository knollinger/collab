import { Component, DestroyRef, inject, Input } from '@angular/core';

import { FilesPickerService, INodeService } from '../../../mod-files/mod-files.module';

import { AbstractShape } from '../../shapes/abstractshape';
import { PatternManager } from '../../patterns/pattern-manager';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-whiteboard-siderbar',
  templateUrl: './whiteboard-siderbar.component.html',
  styleUrls: ['./whiteboard-siderbar.component.css']
})
export class WhiteboardSiderbarComponent {

  readonly borderStyles: string[] = ['solid', 'dotted', 'dashed'];
  readonly borderSizes: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  private _shapes: Array<AbstractShape> = new Array<AbstractShape>();
  private destroyRef: DestroyRef = inject(DestroyRef);

  @Input()
  public patternMgr: PatternManager | undefined;

  /**
   * 
   * @param fileChooserSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private fileChooserSvc: FilesPickerService) {

  }

  @Input()
  set shapes(shapes: Array<AbstractShape>) {

    this._shapes = shapes;
    if (this._shapes.length) {

      const firstShape = this._shapes[0];

      if (firstShape) {
        this._backgroundColor = firstShape.fillColor();
        this._frameColor = firstShape.borderColor();
        this._borderSize = firstShape.borderWidth();
      }
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about position and dimensions                                       */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Das pos/dim-Panel wird nur angezeigt, wenn exakt ein Shape ausgewählt ist
   */
  get showPosSizePanel(): boolean {

    return this._shapes && this._shapes.length === 1;
  }

  /**
   * 
   */
  get posX(): number {

    return (this._shapes && this._shapes.length) ? this._shapes[0].posX : 0;
  }

  /**
   * 
   */
  set posX(val: number) {

    if (this._shapes && this._shapes.length) {
      this._shapes[0].posX = val;
    }
  }

  /**
   * 
   */
  get posY(): number {

    return (this._shapes && this._shapes.length) ? this._shapes[0].posY : 0;
  }

  /**
   * 
   */
  set posY(val: number) {

    if (this._shapes && this._shapes.length) {
      this._shapes[0].posY = val;
    }
  }

  /**
   * 
   */
  get width(): number {

    return (this._shapes && this._shapes.length) ? this._shapes[0].width : 0;
  }

  /**
   * 
   */
  set width(val: number) {
    if (this._shapes && this._shapes.length) {
      this._shapes[0].width = val;
    }
  }


  /**
   * 
   */
  get height(): number {

    return (this._shapes && this._shapes.length) ? this._shapes[0].height : 0;
  }

  /** 
   * 
   */
  set height(val: number) {

    if (this._shapes && this._shapes.length) {
      this._shapes[0].height = val;
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about border colors                                                 */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  private _frameColor: string = '#0000ff';

  /**
   * 
   */
  get frameColor() {
    return this._frameColor;
  }

  /**
   * 
   */
  set frameColor(color: string) {
    this._frameColor = color;
    this._shapes.forEach(shape => {
      shape.setBorderColor(color);
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about border styles                                                  */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  private _borderStyle: string = 'solid';
  get borderStyle() {
    return this._borderStyle;
  }

  /**
   * 
   */
  set borderStyle(style: string) {
    this._borderStyle = style;
    this._shapes.forEach(shape => {
      shape.setBorderStyle(style);
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about border sizes                                                  */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  private _borderSize: number = 1;

  /**
   * 
   */
  get borderSize() {
    return this._borderSize;
  }

  /**
   * 
   */
  set borderSize(size: number) {
    this._borderSize = size;
    this._shapes.forEach(shape => {
      shape.setBorderWidth(size);
    })
  }

  private _fillStyle: string = 'color';

  get fillStyle(): string {
    return this._fillStyle;
  }

  set fillStyle(val: string) {
    this._fillStyle = val;
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about background colors                                             */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  private _backgroundColor: string = '#ffffff';

  /**
   * 
   */
  get backgroundColor(): string {
    return this._backgroundColor;
  }

  /**
   * 
   */
  set backgroundColor(color: string) {
    this._backgroundColor = color;
    this._shapes.forEach(shape => {
      shape.setFillColor(color);
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about background images                                             */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  private _imageUUID: string = '';

  /**
   * 
   */
  get imageUUID(): string {
    return this._imageUUID;
  }

  /**
   * 
   */
  set imageUUID(uuid: string) {

    this._imageUUID = uuid;
    this._shapes.forEach(shape => {
      const pattern = this.patternMgr!.createPattern('image', this.imageUrl);

      // shape.patt
      shape.pattern = pattern;
    });
  }

  get imageUrl(): string {
    return this.inodeSvc.getContentUrl(this.imageUUID);
  }

  get previewUrl(): string {
    return `url('${this.imageUrl}')`;
  }

  /**
   * 
   */
  onShowImageChooser() {

    this.fileChooserSvc.showFilePicker(false, new RegExp('image/.*', 'i'))
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(files => {

      if(files) {
        const inode = [...files][0];

        this.imageUUID = inode.uuid;
        console.dir(this.imageUrl);
      }
    })
  }

  /**
   * 
   * @param evt 
   */
  onRemoveBackgroundImage(evt: Event) {
    evt.stopPropagation();
    this._imageUUID = '';
  }
}
