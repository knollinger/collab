import { Injectable } from '@angular/core';
import { WhiteboardModel } from '../models/whiteboard-model';
import { AbstractShape, IShapeJSON } from '../drawables/shapes/abstractshape';

interface DocumentJSON {
  shapes: IShapeJSON[]
}

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class WhiteboardPersistenceService {

  /**
   * 
   */
  public saveModel(model: WhiteboardModel) {

    const json: DocumentJSON = {
      shapes: model.shapes.map(shape => shape.toJSON())
    }
    console.log(JSON.stringify(json));
  }
}
