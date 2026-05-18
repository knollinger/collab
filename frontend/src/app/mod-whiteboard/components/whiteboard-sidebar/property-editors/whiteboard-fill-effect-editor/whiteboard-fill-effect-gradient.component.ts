import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-whiteboard-fill-effect-gradient',
  templateUrl: './whiteboard-fill-effect-gradient.component.html',
  styleUrls: ['./whiteboard-fill-effect-gradient.component.css']
})
export class WhiteboardFillEffectGradientComponent implements OnInit {

  private _startColor: string = '#ffffff';
  private _stopColor: string = '#000000';
  private _gradientType: EGradientFillDirection = 'TopDown';

  @Output()
  effectChanged: EventEmitter<GradientFillEffect> = new EventEmitter<GradientFillEffect>();

  /**
   * 
   */
  ngOnInit() {
    this.emitGradient();
  }

  /**
   * 
   */
  public set start(color: string) {
    this._startColor = color;
    this.emitGradient();
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
    this.emitGradient();
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
    this.emitGradient();
  }

  /**
   * 
   */
  private emitGradient() {
    this.effectChanged.next(new GradientFillEffect('gradient', this.gradientType, this.start, this.stop));
  }
}
