import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { AbstractFillEffect } from '../../../../fill-effects/abstract-fill-effect';
import { GradientTopDownFillEffect } from '../../../../fill-effects/gradient-top-down-fill-effect';
import { GradientLeftRightFillEffect } from '../../../../fill-effects/gradient-left-right-fill-effect';
import { GradientDiagonalFillEffect } from '../../../../fill-effects/gradient-diagonal-fill-effect';
import { GradientRadialFillEffect } from '../../../../fill-effects/gradient-radial-fill-effect';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-bg-gradient-editor',
  templateUrl: './whiteboard-bg-gradient-editor.component.html',
  styleUrls: ['./whiteboard-bg-gradient-editor.component.css']
})
export class WhiteboardBgGradientEditorComponent {

  _color1: string = '#ffffff';
  _color2: string = '#000000';
  _gardientType: string = 'topDown';
  previewStyle: string = '';

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  constructor() {
    this.calcPreviewStyle();
  }

  public set color1(color: string) {
    this._color1 = color;
    this.calcPreviewStyle();
  }

  public get color1(): string {
    return this._color1;
  }

  public set color2(color: string) {
    this._color2 = color;
    this.calcPreviewStyle();
  }

  public get color2(): string {
    return this._color2;
  }

  public get gradientType(): string {
    return this._gardientType;
  }

  public set gradientType(type: string) {

    this._gardientType = type;
    this.calcPreviewStyle();
  }

  private calcPreviewStyle() {

    let style: string = '';

    switch (this._gardientType) {
      case 'topDown':
        style = `linear-gradient(to bottom, ${this._color1}, ${this._color2})`;
        break;

      case 'leftRight':
        style = `linear-gradient(to right, ${this._color1}, ${this._color2})`;
        break;

      case 'diagonal':
        style = `linear-gradient(to bottom right, ${this._color1}, ${this._color2})`;
        break;

      case 'radial':
        style = `radial-gradient(${this._color1}, ${this._color2})`;
        break;

      default:
        break;
    }
    this.previewStyle = style;
  }

  /**
   * 
   */
  onApply() {

    for (let shape of this.shapes) {

      const effect = this.createGradient();
      if (effect) {
        shape.fillEffect = effect;
      }
    }
  }

  /**
   * 
   * @param svgRoot 
   * @returns 
   */
  createGradient(): AbstractFillEffect | undefined {

    let result: AbstractFillEffect | undefined;

    switch (this._gardientType) {
      case 'topDown':
        result = new GradientTopDownFillEffect(this.model, this._color1, this._color2);
        break;

      case 'leftRight':
        result = new GradientLeftRightFillEffect(this.model, this._color1, this._color2);
        break;

      case 'diagonal':
        result = new GradientDiagonalFillEffect(this.model, this._color1, this._color2);
        break;

      case 'radial':
        result = new GradientRadialFillEffect(this.model, this._color1, this._color2);
        break;

      default:
        break;
    }
    return result;
  }
}
