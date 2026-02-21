import { Component, Input } from '@angular/core';

import { AbstractShape } from '../../shapes/abstractshape';

@Component({
  selector: 'app-whiteboard-siderbar',
  templateUrl: './whiteboard-siderbar.component.html',
  styleUrls: ['./whiteboard-siderbar.component.css']
})
export class WhiteboardSiderbarComponent {

  readonly borderStyles: string[] = ['solid', 'dotted', 'dashed'];
  readonly borderSizes: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  private _shapes: Array<AbstractShape> = new Array<AbstractShape>();

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

  get showPosSizePanel(): boolean {

    return this._shapes && this._shapes.length === 1;
  }

  get posX(): number {

    if (this._shapes && this._shapes.length) {
      return this._shapes[0].posX;

    }
    return 0;
  }

  set posX(val: number) {

    if (this._shapes && this._shapes.length) {
      this._shapes[0].posX = val;
    }
  }

  get posY(): number {

    if (this._shapes && this._shapes.length) {
      return this._shapes[0].posY;

    }
    return 0;
  }

  set posY(val: number) {

    if (this._shapes && this._shapes.length) {
      this._shapes[0].posY = val;
    }
  }

  get width(): number {

    if (this._shapes && this._shapes.length) {
      return this._shapes[0].width;

    }
    return 0;
  }

  set width(val: number) {
    if (this._shapes && this._shapes.length) {
      this._shapes[0].width = val;
    }
  }


  get height(): number {

    if (this._shapes && this._shapes.length) {
      return this._shapes[0].height;
    }
    return 0;
  }

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
  get frameColor() {
    return this._frameColor;
  }

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

  private _borderStyle: string = 'solid';
  get borderStyle() {
    return this._borderStyle;
  }

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
  get borderSize() {
    return this._borderSize;
  }

  set borderSize(size: number) {
    this._borderSize = size;
    this._shapes.forEach(shape => {
      shape.setBorderWidth(size);
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about background colors                                             */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  private _backgroundColor: string = '#ffffff';
  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(color: string) {
    this._backgroundColor = color;
    this._shapes.forEach(shape => {
      shape.setFillColor(color);
    })
  }
}
