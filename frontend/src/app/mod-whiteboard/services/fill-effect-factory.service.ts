import { Injectable } from '@angular/core';
import { RectShape } from '../shapes/rect-shape';
import { EllipsisShape } from '../shapes/ellipsis-shape';
import { RombusShape } from '../shapes/rombus-shape';
import { ParallelogramShape } from '../shapes/parallelogram-shape';
import { AbstractFillEffect } from '../fill-effects/abstract-fill-effect';

@Injectable({
  providedIn: 'root'
})
export class FillEffectFactoryService {

  constructor() { }

  /**
   * @param svgRoot
   * @param type 
   * @param x 
   * @param y 
   * @param w 
   * @param h 
   */
  public createFillEffect(svgRoot: SVGSVGElement, type: string, x: number, y: number, w: number, h: number): AbstractFillEffect {

    switch (type) {
      case 'color':
        break;

      case 'image':
        break;

      case 'gradient':
        break;

      default:
        throw new Error(`unknown fill effect type '${type}`);
        break;
    }
  }
}
