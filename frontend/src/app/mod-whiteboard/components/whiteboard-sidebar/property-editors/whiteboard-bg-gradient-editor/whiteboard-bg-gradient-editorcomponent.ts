import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../../../models/whiteboard-model';
import { EGradientFillDirection, GradientFillEffect } from '../../../../fill-effects/gradient-fill-effect';

/**
 * Die WhiteboardBgGradientEditorComponent dient dem editieren von
 * *GradientFillEffect*-Objekten und der zuweisung an die übergebenen 
 * *AbstractShapes*.
 * 
 * Der Editor besteht aus zwei Color-Pickern (für start und stop color)
 * und einem selector für die *EGradientFillDirection*. 
 * 
 * Bei jeder änderung einer dieser Eigenschaften wird sofort ein 
 * entsprechender *GradientFillEffect* erzeugt und an den übergebenen
 * *AbstractShape*s angewendet. 
 */
@Component({
  selector: 'app-whiteboard-bg-gradient-editor',
  templateUrl: './whiteboard-bg-gradient-editor.component.html',
  styleUrls: ['./whiteboard-bg-gradient-editor.component.css']
})
export class WhiteboardBgGradientEditorComponent {

  private _startColor: string = '#ffffff';
  private _stopColor: string = '#000000';
  private _gradientType: EGradientFillDirection = 'TopDown';

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  @Input()
  public model: WhiteboardModel = WhiteboardModel.empty();

  /**
   * 
   */
  constructor() {
    // TODO: ggf existierende Gradienten ermitteln und deren Werte in die Props setzen
  }

  /**
   * 
   */
  public set start(color: string) {
    this._startColor = color;
    this.applyGradient();
  }

  /**
   * 
   */
  public get start(): string {
    return this._startColor;
  }

  /**
   * 
   */
  public set stop(color: string) {
    this._stopColor = color;
    this.applyGradient();
  }

  /**
   * 
   */
  public get stop(): string {
    return this._stopColor;
  }

  /**
   * 
   */
  public get gradientType(): EGradientFillDirection {
    return this._gradientType;
  }

  /**
   * 
   */
  public set gradientType(type: EGradientFillDirection) {

    this._gradientType = type;
    this.applyGradient();
  }


  /**
   * 
   */
  private applyGradient() {

    for (let shape of this.shapes) {
      this.model.addFillEffect(new GradientFillEffect('gradient', this.gradientType, this.start, this.stop), shape);
    }
  }
}
