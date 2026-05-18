import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractFillEffect } from '../../../../fill-effects/abstract-fill-effect';
import { PatternFillEffect } from '../../../../fill-effects/pattern-fill-effect';

import { WhiteboardTemplateService } from "../../../../services/whiteboard-template.service";

@Component({
  selector: 'app-whiteboard-fill-effect-pattern',
  templateUrl: './whiteboard-fill-effect-pattern.component.html',
  styleUrls: ['./whiteboard-fill-effect-pattern.component.css'],
  standalone: false
})
export class WhiteboardFillEffectPatternComponent implements OnInit {

  @Output()
  public effectChanged: EventEmitter<AbstractFillEffect> = new EventEmitter<AbstractFillEffect>();

  patterns: SVGPatternElement[] = new Array<SVGPatternElement>();

  private destroyRef: DestroyRef = inject(DestroyRef);
  private _selectedPattern: SVGPatternElement = document.createElementNS('http://www.w3.org/2000/svg', 'pattern') as SVGPatternElement;
  private _color: string = '#000000';

  /**
   * 
   * @param templateSvc 
   */
  constructor(private templateSvc: WhiteboardTemplateService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.templateSvc.loadSVGPatterns()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(patterns => {
        this.patterns.push(...patterns);
        this._selectedPattern = patterns[0];
        this.emitPattern();
      });
  }

  /**
   * 
   * @param pattern 
   * @returns 
   */
  getPatternName(pattern: SVGPatternElement): string {
    return pattern.getAttribute('name') || '';
  }

  /**
   * 
   * @param pattern 
   * @returns 
   */
  getPatternWidth(pattern: SVGPatternElement): string {

    return pattern.getAttribute('width') || '10';
  }

  /**
   * 
   */
  getPatternHeight(pattern: SVGPatternElement): string {

    return pattern.getAttribute('height') || '10';
  }

  /**
   * 
   * @param pattern 
   * @returns 
   */
  makeUrl(pattern: SVGPatternElement): string {

    return `url(#${pattern.id})`;
  }

  /**
   * 
   */
  set selectedPattern(pattern: SVGPatternElement) {
    this._selectedPattern = pattern;
    this.emitPattern();
  }

  /**
   * 
   */
  get selectedPattern(): SVGPatternElement {
    return this._selectedPattern;
  }

  /**
   * 
   */
  get color(): string {
    return this._color;
  }

  /**
   * 
   */
  set color(color: string) {
    this._color = color;
    console.log(color);
    
    const newPatterns = new Array<SVGPatternElement>();
    this.patterns.forEach(pattern => {
      pattern.setAttribute('color', color);
      newPatterns.push(pattern);
    });
    this.patterns = newPatterns;
    this.emitPattern();
  }

  /**
   * 
   */
  private emitPattern() {

    this.effectChanged.next(new PatternFillEffect('pattern', this._selectedPattern));
  }
}
