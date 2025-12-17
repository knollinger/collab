import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChangeZOrder } from '../whiteboard-context-menu/whiteboard-context-menu.component';

@Component({
  selector: 'app-whiteboard-editor',
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css']
})
export class WhiteboardEditorComponent {

  private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  private static DEFAULT_SHAPE_WIDTH = 100;
  private static DEFAULT_SHAPE_HEIGHT = 100;

  /**
   * Die Standard-Attribute für ein Rectangle
   */
  private static RECT_ATTRIBUTES = new Map(
    [
      ['width', "100"],
      ['height', '100']
    ]
  );

  /**
   * Die Standard-Attribute für einen Rombus
   */
  private static ROMBUS_ATTRIBUTES = new Map(
    [
      ['points', '50,0 0,50 50,100 100,50 ']

    ]
  );

  /**
   * Die Standard-Attribute für einen Kreis
   */
  private static ELLIPSIS_ATTRIBUTES = new Map(
    [
      ['cx', '50'],
      ['cy', '50'],
      ['rx', '50'],
      ['ry', '50']

    ]
  );

  @ViewChild("svg")
  svg!: ElementRef<HTMLElement>;

  selectedElement: SVGGraphicsElement | undefined = undefined;
  isInDrag: boolean = false;

  /**
   * Liefert das SVG-RootElement
   */
  public get svgRoot(): SVGSVGElement {

    return this.svg.nativeElement as unknown as SVGSVGElement;
  }


  /**
   * Erzeuge ein Rectangle
   */
  onCreateRectangle() {
    this.createElement('rect', WhiteboardEditorComponent.RECT_ATTRIBUTES);
  }

  /**
   * Erzeuge einen Rombus
   */
  onCreateRombus() {
    this.createElement('polygon', WhiteboardEditorComponent.ROMBUS_ATTRIBUTES);
  }


  /**
   * Erzeuge einen Kreis/Ellipse
   */
  onCreateEllipsis() {
    this.createElement('ellipse', WhiteboardEditorComponent.ELLIPSIS_ATTRIBUTES);
  }

  /**
   * Erzeuge das durch den Parameter *type* definierte SVG-Element und setze die
   * übergebenen Attribute.
   * 
   * Zusätzlich werden noch folgende Attribute gesetzt:
   * 
   * * fill=white
   * * stroke-width=1
   * * stroke=black
   * 
   * Desweiteren werden die EventHandler für Drag&Drop und für click mit dem Element
   * assoziert.
   * 
   * Das Element wird in ein Gruppen-Element gewrappt, diese Gruppe wird in die SVGRoot
   * gesetzt. Sinn und Zweck des Wrappings ist es, einen Dekorator-Frame und eine Textbox
   * mit dem Element zu verbinden, diese sollen gemeinsamm transformiert werden 
   * (translate, scale). Dazu werden die Transformationen auf das Gruppen-Element 
   * angewendet, die Gruppen-Member erben diese Transformationen von der Gruppe.
   *  
   * @param type 
   * @param attrs 
   * @returns 
   */
  private createElement(type: string, attrs: Map<string, string>) {

    const elem = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, type) as SVGGraphicsElement;
    attrs.forEach((val: string, key: string) => {
      elem.setAttribute(key, val);
    })

    elem.setAttribute('fill', 'white');
    elem.setAttribute('stroke-width', '1');
    elem.setAttribute('stroke', 'black');

    elem.addEventListener('click', this.onClick.bind(this));

    const group = this.createElementContainer();
    group.appendChild(elem);
    this.svgRoot.appendChild(group);
  }

  /**
   * 
   */
  private createElementContainer(): SVGGElement {

    const group = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, "g") as SVGGElement;

    let transform = this.svgRoot.createSVGTransform();
    transform.setTranslate(0, 0);
    group.transform.baseVal.appendItem(transform);

    transform = this.svgRoot.createSVGTransform();
    transform.setScale(1, 1);
    group.transform.baseVal.appendItem(transform);
    return group;
  }

  /**
   * Ein Element wurde angeklickt
   * 
   * @param evt 
   */
  onClick(evt: Event) {
    if (this.selectedElement) {
      this.createDecoratorFrame(this.selectedElement);
    }
  }

  /**
   * Starte den Drag eines Elements wenn die primäre Maustaste
   * gedrückt wird.
   * 
   * Das zu draggende Element wird als selectedElement gesetzt.
   * 
   * @param evt 
   */
  onDragStart(evt: MouseEvent) {

    const newSelection = evt.target as SVGGraphicsElement;

    if (this.selectedElement && this.selectedElement != newSelection) {
      this.removeDecoratorFrame(this.selectedElement);
    }

    if (newSelection !== this.svgRoot) {
      this.selectedElement = newSelection;
      this.createDecoratorFrame(newSelection);
      this.isInDrag = evt.button == 0;
    }
    else {
      this.selectedElement = undefined;
      this.isInDrag = false;
    }
  }

  /**
   * Bewege das aktuelle Element
   * 
   * @param evt 
   */
  onDrag(evt: MouseEvent) {

    evt.preventDefault();

    if (this.isInDrag && this.selectedElement) {

      const cnr = this.selectedElement.parentElement as unknown as SVGGElement;

      for (let i = 0; i < cnr.transform.baseVal.length; ++i) {

        const transform = cnr.transform.baseVal.getItem(i);
        if (transform.type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {

          const x = transform.matrix.e + evt.movementX;
          const y = transform.matrix.f + evt.movementY;
          transform.setTranslate(x, y);
        }
      }
    }
  }

  /**
   * Beende den Drag
   * 
   * @param evt 
   */
  onDragEnd(evt: Event) {

    if (this.isInDrag) {
      evt.stopPropagation();
      evt.preventDefault();
      this.isInDrag = false;
    }
  }

  /**
   * 
   * @param color 
   */
  onBackgroundColorChange(color: string) {

    if (this.selectedElement) {
      this.selectedElement.setAttribute('fill', color);
    }
  }

  /**
   * 
   * @param color 
   */
  onBorderColorChange(color: string) {

    if (this.selectedElement) {
      this.selectedElement.setAttribute('stroke', color);
    }
  }

  /**
   * 
   */
  onBorderWidthChange(width: number) {

    if (this.selectedElement) {

      this.selectedElement.setAttribute('stroke-width', width.toString());
    }
  }

  /**
   * 
   * @param style 
   */
  onBorderStyleChange(style: string) {

    if (this.selectedElement) {

      const width = Number.parseInt(this.selectedElement.getAttribute('stroke-width') || '1');

      switch (style) {
        case 'solid':
          this.selectedElement.removeAttribute('stroke-dasharray');
          break;

        case 'dotted':
          this.selectedElement.setAttribute('stroke-dasharray', `${width} ${width}`);
          break;

        case 'dashed':
          this.selectedElement.setAttribute('stroke-dasharray', '8 8');
          break;
      }
    }
  }

  /**
   * Ändere die zOrder des selektierten Elements
   * 
   * @param delta ein enumValue vom Typ **ChangeZOrder**
   */
  onChangeZOrder(delta: ChangeZOrder) {

    if (this.selectedElement) {

      const group = this.selectedElement.parentElement;
      if (group) {

        switch (delta) {
          case ChangeZOrder.background:
            this.svgRoot.insertBefore(group, this.svgRoot.firstChild);
            break;

          case ChangeZOrder.back:
            this.svgRoot.insertBefore(group, group.previousSibling);
            break;

          case ChangeZOrder.fore:
            if (group.nextSibling) {
              this.svgRoot.insertBefore(group.nextSibling, group);
            }
            else {
              this.svgRoot.appendChild(group);
            }
            break;

          case ChangeZOrder.foreground:
            this.svgRoot.appendChild(group);
            break;
        }
      }
    }
  }

  /**
   * Erzeuge den DekoratorFrame, dieser wird zum skalieren benötigt.
   * 
   * @param elem 
   */
  private createDecoratorFrame(elem: SVGElement) {

    const elemGroup = elem.parentElement;
    if (elemGroup && !this.hasDecorator(elem)) {

      const decoratorGroup = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, "g") as SVGGElement;

      const frame = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, "rect") as SVGGElement;
      frame.setAttribute('x', '-8');
      frame.setAttribute('y', '-8');
      frame.setAttribute('width', '116');
      frame.setAttribute('height', '116');
      frame.setAttribute('stroke', 'lightgray');
      frame.setAttribute('stroke-width', '2');
      frame.setAttribute('stroke-dasharray', '2 2');
      frame.setAttribute('fill', 'transparent');
      decoratorGroup.appendChild(frame);

      decoratorGroup.appendChild(this.createResizeAnchor(-12, -12, 'nw'));
      decoratorGroup.appendChild(this.createResizeAnchor(-12, 46, 'w'));
      decoratorGroup.appendChild(this.createResizeAnchor(-12, 104, 'sw'));
      decoratorGroup.appendChild(this.createResizeAnchor(46, -12, 'n'));
      decoratorGroup.appendChild(this.createResizeAnchor(46, 104, 's'));
      decoratorGroup.appendChild(this.createResizeAnchor(104, -12, 'ne'));
      decoratorGroup.appendChild(this.createResizeAnchor(104, 46, 'e'));
      decoratorGroup.appendChild(this.createResizeAnchor(104, 104, 'se'));

      elemGroup.insertBefore(decoratorGroup, elemGroup.firstChild);
    }
  }

  /**
   * Entferne den DecoratorFrame und alle ResizeAnchors
   * 
   * @param elem 
   */
  removeDecoratorFrame(elem: SVGElement) {

    if (this.hasDecorator(elem)) {
      elem.parentElement!.firstChild!.remove();
    }
  }

  /**
   * Erzeuge einen ResizeAnchor
   * 
   * @param x 
   * @param y 
   * @param name 
   * @returns 
   */
  private createResizeAnchor(x: number, y: number, name: string): SVGElement {

    const anchor = document.createElementNS(WhiteboardEditorComponent.SVG_NAMESPACE, "rect") as SVGGElement;
    anchor.setAttribute('name', name);
    anchor.setAttribute('x', x.toString());
    anchor.setAttribute('y', y.toString());
    anchor.setAttribute('width', "8");
    anchor.setAttribute('height', "8");
    anchor.setAttribute('stroke', "black");
    anchor.setAttribute('stroke-width', "1");
    anchor.setAttribute('fill', "green");
    anchor.setAttribute('class', `drag-${name}`)

    anchor.addEventListener('mousedown', evt => {
      this.onStartResize(anchor, evt)
    });
    anchor.addEventListener('mousemove', evt => {
      this.onResize(anchor, evt)
    });
    anchor.addEventListener('mouseup', evt => {
      this.onStopResize(anchor, evt)
    });
    return anchor;
  }

  /**
   * Hat das angegebene Element bereits einen Decorator?
   * 
   * @param elem 
   * @returns 
   */
  private hasDecorator(elem: SVGElement): boolean {

    let result = false;

    const elemGroup = elem.parentElement;
    if (elemGroup) {
      result = elemGroup.childNodes.length > 1;
    }

    return result;
  }

  /**
   * Beginne das draggen eines ResizeAnchors
   * 
   * @param anchor 
   */
  private onStartResize(anchor: SVGElement, evt: MouseEvent) {

    evt.stopPropagation();
  }

  /**
   * Ein Resize-Anchor wird gedragged
   * 
   * @param anchor 
   * @param evt 
   */
  private onResize(anchor: SVGElement, evt: MouseEvent) {

    evt.stopPropagation();
    switch (anchor.getAttribute('name')) {
      case 'n':
        break;

      case 'e':
        break;

      case 'w':
        break;

      case 's':
        break;

      case 'nw':
        break;

      case 'ne':
        break;

      case 'sw':
        break;

      case 'se':
        break;
    }
  }

  /**
   * Das dragging eines ResizeAnchors wurde beendet
   * 
   * @param anchor 
   * @param evt 
   */
  private onStopResize(anchor: SVGElement, evt: MouseEvent) {

    evt.stopPropagation();
  }
}
