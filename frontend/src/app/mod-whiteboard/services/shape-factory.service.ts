import { Injectable } from '@angular/core';
import { RectShape } from '../shapes/rect-shape';
import { EllipsisShape } from '../shapes/ellipsis-shape';
import { RombusShape } from '../shapes/rombus-shape';

@Injectable({
  providedIn: 'root'
})
export class ShapeFactoryService {

  constructor() { }

  /**
   * @param svgRoot
   * @param type 
   * @param x 
   * @param y 
   * @param w 
   * @param h 
   */
  public createShape(svgRoot: SVGSVGElement, type: string, x: number, y: number, w: number, h: number) {

    switch (type) {
      case 'rect':
        return new RectShape(svgRoot, x, y, w, h);
        break;

      case 'ellipse':
        return new EllipsisShape(svgRoot, x, y, w, h);
        break;

      case 'rombus':
        return new RombusShape(svgRoot, x, y, w, h);
        break;

      default:
        throw new Error(`unknown shape type '${type}`);
        break;
    }
  }
}
