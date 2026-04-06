import { Component, Input } from '@angular/core';
import { WhiteboardDocument } from '../../../../models/whiteboard-document';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';

@Component({
  selector: 'app-whiteboard-text-editor',
  templateUrl: './whiteboard-text-editor.component.html',
  styleUrls: ['./whiteboard-text-editor.component.css']
})
export class WhiteboardTextEditorComponent {

  @Input()
  model: WhiteboardDocument = WhiteboardDocument.empty();

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  get text(): string {
    return this.shapes.length ? this.shapes[0].text : '';
  }

  set text(text: string) {
    if (this.shapes.length) {
      this.shapes[0].text = text;
    }
  }
}
