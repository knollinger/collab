import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AbstractFillEffect } from '../../../../fill-effects/abstract-fill-effect';
import { ColorFillEffect } from "../../../../fill-effects/color-fill-effect";

@Component({
  selector: 'app-whiteboard-fill-effect-color',
  templateUrl: './whiteboard-fill-effect-color.component.html',
  styleUrls: ['./whiteboard-fill-effect-color.component.css'],
  standalone: false
})
export class WhiteboardFillEffectColorComponent implements OnInit {

  @Output()
  public effectChanged: EventEmitter<AbstractFillEffect> = new EventEmitter<AbstractFillEffect>();
  private _color: string = '#000000';

  ngOnInit() {
    this.emitFillEffect();
  }

  /**
   * 
   */
  set color(color: string) {

    this._color = color;
    this.emitFillEffect();
  }

  /**
   * 
  */
  get color(): string {
    return this._color;
  }

  private emitFillEffect() {
    this.effectChanged.next(new ColorFillEffect('color', this.color));
  }
}
