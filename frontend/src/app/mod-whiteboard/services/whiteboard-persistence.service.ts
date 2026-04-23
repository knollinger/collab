import { Injectable } from '@angular/core';
import { WhiteboardModel } from '../models/whiteboard-model';
import { AbstractShape, IShapeJSON } from '../drawables/shapes/abstractshape';
import { Observable, Subject } from 'rxjs';
import { INodeService } from '../../mod-files/services/inode.service';
import { AbstractFillEffect } from '../fill-effects/abstract-fill-effect';
import { ColorFillEffect, IColorFillEffectJSON } from '../fill-effects/color-fill-effect';
import { GradientFillEffect, IGradientFillEffectJSON } from '../fill-effects/gradient-fill-effect';
import { IImageFillEffectJSON, ImageFillEffect } from '../fill-effects/image-fill-effect';
import { RectShape } from '../drawables/shapes/rect-shape';
import { EllipsisShape } from '../drawables/shapes/ellipsis-shape';
import { RombusShape } from '../drawables/shapes/rombus-shape';
import { INode } from '../../mod-files-data/mod-files-data.module';

export interface IWhiteboardJSON {

  fillEffects: any[],
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
   * @param inodeSvc 
   */
  constructor(private inodeSvc: INodeService) {

  }

  /**
   * 
   */
  public saveModel(uuid: string, model: WhiteboardModel): Observable<INode> {

    const json = {
      shapes: model.shapes.map(shape => shape.toJSON()),
      fillEffects: [...model.fillEffects].map(effect => effect.toJSON())
    }

    const blob = new Blob([JSON.stringify(json)], {
      type: 'application/colab-whiteboard'
    });
    return this.inodeSvc.saveContent(uuid, blob);
  }

  /**
   * 
   * @param uuid 
   * @param svgRoot 
   * @returns 
   */
  public loadModel(uuid: string, svgRoot: SVGSVGElement): Observable<WhiteboardModel> {

    const result = new Subject<WhiteboardModel>();
    this.inodeSvc.loadContent(uuid, undefined)
      .subscribe(blob => {

        blob.text().then(text => {

          const model = new WhiteboardModel(svgRoot);

          const json = JSON.parse(text);
          this.createShapes(json, model);

          result.next(model);
        });
      })
    return result;
  }

  /**
   * 
   * @param json 
   * @param model 
   */
  private createShapes(json: IWhiteboardJSON, model: WhiteboardModel) {

    const fillEffectsMap = this.loadFillEffects(json);

    json.shapes.forEach(shapeDesc => {

      const shape = this.createShape(shapeDesc, model.svgRoot);
      model.addShape(shape);

      const fillId = shapeDesc.fill;
      if (fillId && fillEffectsMap.get(fillId)) {
        model.addFillEffect(fillEffectsMap.get(fillId)!, shape);
      }
    })
  }

  /**
   * 
   * @param shapeDesc 
   * @param svgRoot 
   * @returns 
   */
  createShape(shapeDesc: IShapeJSON, svgRoot: SVGSVGElement): AbstractShape {

    let shape: AbstractShape;
    switch (shapeDesc.type) {
      case 'rect':
        shape = RectShape.fromJSON(svgRoot, shapeDesc);
        break;

      case 'ellipse':
        shape = EllipsisShape.fromJSON(svgRoot, shapeDesc);
        break;

      case 'rombus':
        shape = RombusShape.fromJSON(svgRoot, shapeDesc);
        break;

      default:
        throw new Error(`unknown shape type ${shapeDesc.type}`);
    }
    return shape;
  }

  /**
   * Die FillEffects werden erst mal in eine Map geladen, der Key ist die
   * EffectId der Value der Effect.
   * 
   * @param json 
   * @returns 
   */
  private loadFillEffects(json: IWhiteboardJSON): Map<string, AbstractFillEffect> {

    const result: Map<string, AbstractFillEffect> = new Map<string, AbstractFillEffect>();

    json.fillEffects.forEach(effectJson => {

      let effect: AbstractFillEffect;

      switch (effectJson.type) {
        case 'color':
          effect = ColorFillEffect.fromJSON(effectJson as IColorFillEffectJSON)
          break;

        case 'gradient':
          effect = GradientFillEffect.fromJSON(effectJson as IGradientFillEffectJSON);
          break;

        case 'image':
          effect = ImageFillEffect.fromJSON(effectJson as IImageFillEffectJSON, this.inodeSvc);
          break;

        default:
          throw new Error(`unknown fill effect type ${effectJson.type}`);
      }

      result.set(effectJson.id, effect);
    })
    return result;
  }
}
