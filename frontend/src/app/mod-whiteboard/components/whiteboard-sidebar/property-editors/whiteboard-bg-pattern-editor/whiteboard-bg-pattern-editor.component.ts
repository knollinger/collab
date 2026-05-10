import { AfterViewInit, Component, DestroyRef, inject, Input } from '@angular/core';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-bg-pattern-editor',
  templateUrl: './whiteboard-bg-pattern-editor.component.html',
  styleUrls: ['./whiteboard-bg-pattern-editor.component.css']
})
export class WhiteboardBgPatternEditorComponent implements AfterViewInit {

  @Input()
  public shapes: Array<AbstractShape> | undefined = new Array<AbstractShape>();

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  patterns: SVGPatternElement[] = new Array<SVGPatternElement>();

  private destroyRef: DestroyRef = inject(DestroyRef);
  selected: SVGPatternElement = document.createElementNS(WhiteboardModel.SVG_NAMESPACE, 'pattern') as SVGPatternElement;


  ngAfterViewInit(): void {

    this.patterns = this.model.predefinedFillPatterns;
    console.log(this.patterns);
  }

  getPatternName(pattern: SVGPatternElement): string {
    return pattern.getAttribute('name') || '';
  }

  getPatternWidth(pattern: SVGPatternElement): string {

    return pattern.getAttribute('width') || '10';
  }

  getPatternHeight(pattern: SVGPatternElement): string {

    return pattern.getAttribute('height') || '10';
  }

  makeUrl(pattern: SVGPatternElement): string {

    return `url(#${pattern.id})`;
  }

  onClick(pattern: SVGPatternElement) {

    console.log(pattern);
    this.selected = pattern;
  }

  isSelected(pattern: SVGPatternElement): boolean {
    return pattern.getAttribute('id') == this.selected.getAttribute('id');
  }

  onApply() {

    // this.shapes?.forEach(shape => {
    //   shape.fillEffect = undefined;
    //   shape.svgElem.setAttribute('fill') = this.makeUrl();
    // })
  }
}
