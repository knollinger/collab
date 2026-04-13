import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-pos-size-editor',
  templateUrl: './whiteboard-pos-size-editor.component.html',
  styleUrls: ['./whiteboard-pos-size-editor.component.css']
})
export class WhiteboardPosSizeEditorComponent {

  private _shapes: Array<AbstractShape> = new Array<AbstractShape>();
  private _x: number = 0;
  private _y: number = 0;
  private _w: number = 0;
  private _h: number = 0;

  @Input()
  public set shapes(shapes: AbstractShape[]) {

    this._shapes = shapes;
    if (shapes.length) {

      const firstShape = shapes[0];
      this._x = firstShape.posX;
      this._y = firstShape.posY;
      this._w = firstShape.width;
      this._h = firstShape.height;
    }
  }

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  get x(): number {
    return this._x;
  }

  set x(val: number) {
    this._x = val;
    this._shapes.forEach(shape => {
      shape.posX = val;
    })
  }

  get y(): number {
    return this._y;
  }

  set y(val: number) {
    this._y = val;
    this._shapes.forEach(shape => {
      shape.posY = val;
    })
  }

  get w(): number {
    return this._w;
  }

  set w(val: number) {
    this._w = val;
    this._shapes.forEach(shape => {
      shape.width = val;
    })
  }


  get h(): number {
    return this._h;
  }

  set h(val: number) {
    this._h = val;
    this._shapes.forEach(shape => {
      shape.height = val;
    })
  }
}
