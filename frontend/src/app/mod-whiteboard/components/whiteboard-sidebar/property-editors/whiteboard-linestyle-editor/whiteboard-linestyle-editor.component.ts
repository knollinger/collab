import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-linestyle-editor',
  templateUrl: './whiteboard-linestyle-editor.component.html',
  styleUrls: ['./whiteboard-linestyle-editor.component.css']
})
export class WhiteboardLinestyleEditorComponent {

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  readonly borderStyles: string[] = ['solid', 'dotted', 'dashed'];

  private _lineStyle: string = 'solid';
  private _lineColor: string = '#000000';
  private _lineWidth: number = 1;

  /**
   * 
   */
  set lineStyle(style: string) {
    this._lineStyle = style;
    for (let shape of this.shapes) {
      shape.borderStyle = style;
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
      shape.borderColor = color;

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
      shape.borderWidth = width;

    }
  }

  /**
   * 
   */
  get lineWidth(): number {
    return this._lineWidth;
  }
}
