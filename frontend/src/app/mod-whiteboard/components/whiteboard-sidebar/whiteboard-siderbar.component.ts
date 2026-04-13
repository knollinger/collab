import { Component, DestroyRef, inject, Input } from '@angular/core';

import { FilesPickerService, INodeService } from '../../../mod-files/mod-files.module';

import { AbstractShape } from '../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-siderbar',
  templateUrl: './whiteboard-siderbar.component.html',
  styleUrls: ['./whiteboard-siderbar.component.css']
})
export class WhiteboardSiderbarComponent {

  private _shapes: Array<AbstractShape> = new Array<AbstractShape>();
  private destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * 
   * @param fileChooserSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private fileChooserSvc: FilesPickerService) {

  }

  @Input()
  set shapes(shapes: Iterable<AbstractShape>) {
    this._shapes = Array.of(...shapes);
  }

  get shapes(): AbstractShape[] {
    return this._shapes;
  }

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  fillStyle: string = 'color';
}
