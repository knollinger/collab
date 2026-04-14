import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { ColorFillEffect } from '../../../../fill-effects/color-fill-effect';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-bg-color-editor',
  templateUrl: './whiteboard-bg-color-editor.component.html',
  styleUrls: ['./whiteboard-bg-color-editor.component.css']
})
export class WhiteboardBgColorEditorComponent {

  private _color: string = '#ffffff';

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  /**
   * 
   */
  set color(color: string) {

    this._color = color;
    for (let shape of this.shapes) {
      shape.fillEffect = new ColorFillEffect('color', this.model, color);
    }
  }

  get color(): string {
    return this._color;
  }
}
