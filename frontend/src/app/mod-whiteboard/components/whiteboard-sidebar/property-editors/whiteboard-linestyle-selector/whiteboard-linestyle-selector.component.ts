import { Component, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';

@Component({
  selector: 'app-whiteboard-linestyle-selector',
  templateUrl: './whiteboard-linestyle-selector.component.html',
  styleUrls: ['./whiteboard-linestyle-selector.component.css']
})
export class WhiteboardLinestyleSelectorComponent {

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  readonly borderStyles: string[] = ['solid', 'dotted', 'dashed'];
  readonly borderSizes: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  
  lineStyle: string = 'solid';
  lineColor: string = '#000000';
  lineWidth: number = 1;

  get cssStyle(): string {

    const style = `${this.lineWidth}px ${this.lineStyle} ${this.lineColor}`;
    return style;
  }

  /**
   * 
   */
  onApply() {

    for (let shape of this.shapes) {
      shape.setBorderColor(this.lineColor);
      shape.setBorderStyle(this.lineStyle);
      shape.setBorderWidth(this.lineWidth);
      
    }
  }
}
