import { Injectable } from '@angular/core';
import { RectShape } from '../shapes/rect-shape';
import { EllipsisShape } from '../shapes/ellipsis-shape';
import { RombusShape } from '../shapes/rombus-shape';
import { ParallelogramShape } from '../shapes/parallelogram-shape';
import { AbstractShape } from '../shapes/abstractshape';

@Injectable({
  providedIn: 'root'
})
export class ShapeFactoryService {

  constructor() { }

  /**
   * @param svgRoot
   * @param type 
   */
  public createShape(svgRoot: SVGSVGElement, type: string): AbstractShape {

    switch (type) {
      case 'rect':
        return new RectShape(svgRoot);
        break;

      case 'ellipse':
        return new EllipsisShape(svgRoot);
        break;

      case 'rombus':
        return new RombusShape(svgRoot);
        break;

      case 'parallelogram':
        return new ParallelogramShape(svgRoot);
        break;

      default:
        throw new Error(`unknown shape type '${type}`);
        break;
    }
  }
}
