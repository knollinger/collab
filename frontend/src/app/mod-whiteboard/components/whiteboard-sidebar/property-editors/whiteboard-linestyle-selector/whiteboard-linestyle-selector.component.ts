import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardDocument } from '../../../../models/whiteboard-document';

@Component({
  selector: 'app-whiteboard-linestyle-selector',
  templateUrl: './whiteboard-linestyle-selector.component.html',
  styleUrls: ['./whiteboard-linestyle-selector.component.css']
})
export class WhiteboardLinestyleSelectorComponent {

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  @Input()
  model: WhiteboardDocument = WhiteboardDocument.empty();

  readonly borderStyles: string[] = ['solid', 'dotted', 'dashed'];
  readonly borderSizes: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  private _lineStyle: string = 'solid';
  private _lineColor: string = '#000000';
  private _lineWidth: number = 1;

  /**
   * 
   */
  set lineStyle(style: string) {
    this._lineStyle = style;
    for (let shape of this.shapes) {
      shape.setBorderStyle(style);

    }
  }

  /**
   * 
   */
  get lineStyle(): string {
    return this._lineStyle;
  }

  /**
   * 
   */
  set lineColor(color: string) {
    this._lineColor = color;
    for (let shape of this.shapes) {
      shape.setBorderColor(color);

    }
  }

  /**
   * 
   */
  get lineColor(): string {
    return this._lineColor;
  }

  /**
   * 
   */
  set lineWidth(width: number) {
    this._lineWidth = width;
    for (let shape of this.shapes) {
      shape.setBorderWidth(width);

    }
  }

  /**
   * 
   */
  get lineWidth(): number {
    return this._lineWidth;
  }
}
