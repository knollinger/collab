import { Component, Input } from '@angular/core';
import { WhiteboardModel } from '../../../../models/whiteboard-model';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';

@Component({
  selector: 'app-whiteboard-text-editor',
  templateUrl: './whiteboard-text-editor.component.html',
  styleUrls: ['./whiteboard-text-editor.component.css']
})
export class WhiteboardTextEditorComponent {

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();


  /**
   * 
   */
  get textContent(): string {
    return this.shapes.length ? this.shapes[0].textContent : '';
  }

  /**
   * 
   */
  set textContent(text: string) {

    if (this.shapes.length) {
      this.shapes[0].textContent = text;
    }
  }

  set alignment(val: string) {

    this.shapes.forEach(shape => {
      shape.textAlignment = val;
    })
  }

  get alignment(): string {
    return this.shapes.length ? this.shapes[0].textAlignment : '';
  }
}
