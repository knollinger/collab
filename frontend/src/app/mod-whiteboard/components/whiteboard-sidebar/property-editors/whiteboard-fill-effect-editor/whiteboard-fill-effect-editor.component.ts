import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractFillEffect } from '../../../../fill-effects/abstract-fill-effect';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-fill-effect-editor',
  templateUrl: './whiteboard-fill-effect-editor.component.html',
  styleUrls: ['./whiteboard-fill-effect-editor.component.css'],
  standalone: false
})
export class WhiteboardFillEffectEditorComponent implements AfterViewInit {

  private _effectType: string = 'none';

  @ViewChild('previewSVGRoot')
  private previewRootRef!: ElementRef<SVGSVGElement>;
  private previewDefs: SVGDefsElement | undefined;
  private previewRect: SVGRectElement | undefined;

  private currentEffect: AbstractFillEffect | undefined;

  @Input()
  public shapes: Array<AbstractShape> = new Array<AbstractShape>();

  @Input()
  public model: WhiteboardModel = WhiteboardModel.empty();

  /**
   * 
   */
  ngAfterViewInit() {

    const previewRoot = this.previewRootRef.nativeElement;
    this.previewDefs = previewRoot.getElementsByTagName('defs')[0];
    this.previewRect = previewRoot.getElementsByTagName('rect')[0];
  }

  /**
   * 
   */
  set effectType(type: string) {
    this._effectType = type;
  }

  /**
   * 
   */
  get effectType(): string {
    return this._effectType;
  }

  /**
   * 
   * @param effect 
   */
  onApplyToPreview(effect: AbstractFillEffect) {

    this.currentEffect = effect;

    // lösche alles im defs-Element der Preview
    while (this.previewDefs?.hasChildNodes()) {
      this.previewDefs?.removeChild(this.previewDefs.firstChild!);
    }

    // Die Dimensionen des Effects an die Preview anpassen
    const rect = this.previewRect?.getBoundingClientRect();
    effect.height = rect?.height || 100;
    effect.width = rect?.width || 100;

    // füge einen clone des effects ins defs element ein
    this.previewDefs?.appendChild(effect.effectElem.cloneNode(true));

    // setze die fill-url des previewRects
    this.previewRect?.setAttribute('fill', `url(#${effect.id})`);
  }

  /**
   * 
   */
  onApplyToTargets() {

    if (this.currentEffect) {
      
      for (let shape of this.shapes) {
        this.model.addFillEffect(this.currentEffect.clone(), shape); // TODO: muss geklont werden, so dass für jedes Element ein eigener Effekt existiert!
      }
    }
  }
}
