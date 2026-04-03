import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { ColorFillEffect } from '../../../../fill-effects/color-fill-effect';

@Component({
  selector: 'app-whiteboard-bg-color-selector',
  templateUrl: './whiteboard-bg-color-selector.component.html',
  styleUrls: ['./whiteboard-bg-color-selector.component.css']
})
export class WhiteboardBgColorSelectorComponent {

  color: string = '#ffffff';

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  /**
   * 
   */
  onApply() {

    for (let shape of this.shapes) {
      shape.fillEffect = new ColorFillEffect(shape.svgRoot, this.color);
    }
  }
}
