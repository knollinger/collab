import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-zorder-editor',
  templateUrl: './whiteboard-zorder-editor.component.html',
  styleUrls: ['./whiteboard-zorder-editor.component.css']
})
export class WhiteboardZorderEditorComponent {

  @Input()
  shapes: Array<AbstractShape> = new Array<AbstractShape>();

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();
}
