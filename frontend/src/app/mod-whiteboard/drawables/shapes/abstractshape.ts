import { AbstractFillEffect, IFillEffectJSON } from "../../fill-effects/abstract-fill-effect"
import { DragAnchor, DragDirection } from "../anchors/drag-anchor";

export interface MouseButtonCallback {
    (evt: MouseEvent, shape: AbstractShape): void;
}

export interface StartResizeCallback {
    (evt: MouseEvent, shape: AbstractShape, mode: string): void;
}

export interface StartConnectCallback {
    (evt: MouseEvent, shape: AbstractShape, mode: string): void;
}

export interface ShapeChangedCallback {
    (shape: AbstractShape): void;
}

export interface IShapeBorderJSON {
    width: number,
    color: string,
    style: string
}

export interface IShapeRect {
    x: number,
    y: number,
    w: number,
    h: number
}

export interface IShapeJSON {
    type: string,
    rect: IShapeRect,
    text: string,
    border: IShapeBorderJSON,
    fill?: string
}

/**
 * 
 */
export abstract class AbstractShape {

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    public readonly elemCnr: SVGGElement;
    private dragAnchorsGroup: SVGGElement;
    private textFieldCnr: SVGForeignObjectElement;

    private _onChanged: ShapeChangedCallback = () => { };
    private _onClick: MouseButtonCallback = () => { };
    private _onStartDrag: MouseButtonCallback = () => { };
    private _onShowCtxMenu: MouseButtonCallback = () => { };


    /**
     * 
     * @param svgRoot 
     */
    constructor(
        private type: string,
        private svgRoot: SVGSVGElement,
        public readonly svgElem: SVGGraphicsElement) {

        this.svgElem.setAttribute('fill', '#ffffff');
        this.svgElem.setAttribute('stroke-width', '1');
        this.svgElem.setAttribute('stroke', '#000000');
        this.svgElem.setAttribute('filter', 'drop-shadow(5px 5px 2px rgb(0 0 0 /  0.2)');
        this.addEventHandlers(this.svgElem);

        this.textFieldCnr = this.createTextField();
        this.addEventHandlers(this.textFieldCnr);

        this.elemCnr = this.createElementContainer();
        this.elemCnr.appendChild(this.svgElem);
        this.elemCnr.appendChild(this.textFieldCnr);

        this.dragAnchorsGroup = document.createElementNS(AbstractShape.SVG_NAMESPACE, "g") as SVGGElement;
        this.dragAnchorsGroup.setAttribute('name', 'resize-anchors');
        this.dragAnchorsGroup.setAttribute('class', 'hidden');
        this.elemCnr.appendChild(this.dragAnchorsGroup);
    }

    /**
     * 
     * @param elem 
     */
    private addEventHandlers(elem: SVGElement) {

        elem.addEventListener('click', evt => {
            evt.stopPropagation();
            this._onClick(evt as MouseEvent, this);
        })

        elem.addEventListener('mousedown', evt => {
            evt.stopPropagation();
            this._onStartDrag(evt as MouseEvent, this);
        });

        elem.addEventListener('contextmenu', evt => {
            evt.stopPropagation();
            this._onShowCtxMenu(evt as MouseEvent, this);
        });
    }

    /**
     * 
     * @param callback 
     */
    public set onShapeChanged(callback: ShapeChangedCallback) {
        this._onChanged = callback;
    }

    /**
     * setze den MouseDown-Callback
     */
    public set onClick(callback: MouseButtonCallback) {
        this._onClick = callback;
    }

    /**
     * setze den MouseDown-Callback
     */
    public set onStartDrag(callback: MouseButtonCallback) {
        this._onStartDrag = callback;
    }

    /**
     * setze den ContextMenu-Callback
     */
    public set onShowCtxMenu(callback: MouseButtonCallback) {
        this._onShowCtxMenu = callback;
    }


    /**
     * 
     * @param val 
     */
    public showSelectionFrame(val: boolean) {

        if (val) {
            this.removeClass(this.dragAnchorsGroup, 'hidden');
        }
        else {
            this.addClass(this.dragAnchorsGroup, 'hidden');
        }
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about json presentation                                           */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/
    toJSON(): IShapeJSON {
        return {
            type: this.type,
            rect: {
                x: this.posX,
                y: this.posY,
                w: this.width,
                h: this.height,
            },
            border: {
                width: this.borderWidth,
                color: this.borderColor,
                style: this.borderStyle
            },
            fill: this._fillEffect ? this._fillEffect.id : undefined,
            text: this.textContent,

        }
    }

    /**
     * 
     * @param json 
     */
    protected loadJSONProps(json: IShapeJSON) {

        this.posX = json.rect.x;
        this.posY = json.rect.y;
        this.width = json.rect.w;
        this.height = json.rect.h;

        this.borderColor = json.border.color;
        this.borderStyle = json.border.style;
        this.borderWidth = json.border.width;

        console.log(json);
        this.textContent = json.text;
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @returns 
     */
    public intersectsRect(x: number, y: number, width: number, height: number): boolean {

        const minX = Math.min(this._x, x);
        const maxX = Math.max(this._x + this._width, x + width);
        const minY = Math.min(this._y, y);
        const maxY = Math.max(this._y + this._height, y + height);

        return (maxX - minX) <= (this._width + width) &&
            (maxY - minY) <= (this._height + height);
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @returns 
     */
    public isInRect(x: number, y: number, width: number, height: number): boolean {

        return this._x >= x &&
            this._x + this._width <= x + width &&
            this._y >= y &&
            this._y + this._height <= y + height;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about positions                                                   */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     */
    private _x: number = 0;
    public get posX(): number {

        return this._x;
    }

    /**
     * 
     */
    public set posX(val: number) {

        this._x = val;
        this.findTranslateTransformation().setTranslate(this._x, this._y);
        this._onChanged(this);
    }

    /**
     * 
     */
    private _y: number = 0;
    public get posY(): number {

        return this._y;
    }

    /**
     * 
     */
    public set posY(val: number) {

        this._y = val;
        this.findTranslateTransformation().setTranslate(this._x, this._y);
        this._onChanged(this);

    }

    /**
     * Verschiebe den Shape um die angegebenen X/Y-Werte
     * 
     * Dazu wird einfach das äußerste Group-Element verschoben
     * 
     * @param movementX 
     * @param movementY 
     */
    public translateBy(movementX: number, movementY: number) {

        const transform = this.findTranslateTransformation();
        this._x += movementX;
        this._y += movementY;
        transform.setTranslate(this._x, this._y);
        this._onChanged(this);

    }

    /**
     * Die Postion (X,Y) wird durch eine Transformation auf der äußeren Gruppe
     * vorgenommen. Finde also diese SVGTransformation. Wenn keine existiert 
     * so lege sie mit den aktuellen Werten an.
     * 
     * @returns 
     */
    private findTranslateTransformation(): SVGTransform {

        for (let i = 0; i < this.elemCnr.transform.baseVal.length; ++i) {

            const transform = this.elemCnr.transform.baseVal.getItem(i);
            if (transform.type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                return transform;
            }
        }

        let transform = this.svgRoot.createSVGTransform();
        transform.setTranslate(this._x, this._y);
        this.elemCnr.transform.baseVal.appendItem(transform);
        return transform;
    }

    private _width: number = 0;
    public get width(): number {
        return this._width;
    }

    public set width(val: number) {
        this._width = val;
        this.resize();
    }

    private _height: number = 0;
    public get height(): number {
        return this._height;
    }

    public set height(val: number) {

        this._height = val;
        this.resize();
    }

    /**
     * 
     * @param resizeX 
     * @param resizeY 
     */
    public resizeBy(resizeX: number, resizeY: number) {

        this._width = this._width + resizeX;
        this._height = this._height + resizeY;
        this.resize();
    }

    private resize() {

        this.textFieldCnr.setAttribute('width', this._width.toString());
        this.textFieldCnr.setAttribute('height', this._height.toString());

        this.onResizeImpl(this._width, this._height);

        if (this._fillEffect) {
            this._fillEffect.height = this._height;
            this._fillEffect.width = this._width;
        }
        this._onChanged(this);

    }

    /**
     * 
     */
    public delete() {

        if (this._fillEffect) {
            this._fillEffect.remove();
        }
        this.elemCnr.remove();
        this._onChanged(this);
    }

    private _fillEffect: AbstractFillEffect | undefined;
    public set fillEffect(effect: AbstractFillEffect) {

        this._fillEffect = effect;
        this._fillEffect.width = this._width;
        this._fillEffect.height = this._height;
        this.svgElem.setAttribute('fill', `url(#${effect.id})`);
    }

    public get fillEffect(): AbstractFillEffect | undefined {
        return this._fillEffect;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about border properties                                           */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/
    private _borderStyle: string = 'solid';

    /**
     * Setze die Farbe der Linie. 
     * 
     * @param color 
     */
    public set borderColor(color: string) {

        this.svgElem.setAttribute('stroke', color);
        this.svgElem.setAttribute('filter', `drop-shadow(5px 5px 2px rgb(from ${color} r g b / 0.2))`);
    }

    /**
     * liefere die Farbe der Linie, default ist '#000000'
     */
    public get borderColor(): string {
        return this.svgElem.getAttribute('stroke') || '#000000';
    }

    /**
     * 
     * @param style 
     */
    public set borderStyle(style: string) {

        this._borderStyle = style;
        this.recalcSvgBorder();
    }

    /**
     * 
     */
    public get borderStyle(): string {
        return this._borderStyle;
    }

    /**
     * 
     */
    private recalcSvgBorder() {

        const width = Number.parseInt(this.svgElem.getAttribute('stroke-width') || '1');
        switch (this._borderStyle) {
            case 'solid':
                this.svgElem.removeAttribute('stroke-dasharray');
                break;

            case 'dotted':
                this.svgElem.setAttribute('stroke-dasharray', `${width} ${width}`);
                break;

            case 'dashed':
                this.svgElem.setAttribute('stroke-dasharray', `${width * 1.5}`);
                break;
        }
    }

    /**
     * 
     * @param width 
     */
    public set borderWidth(width: number) {

        this.svgElem.setAttribute('stroke-width', width.toString());
        this.recalcSvgBorder();
    }

    /**
     * 
     */
    public get borderWidth(): number {

        const result = this.svgElem.getAttribute('stroke-width') || '1';
        return Number.parseInt(result);
    }

    /**
     * Lösche das Element
     */
    remove() {
        this.elemCnr.remove();
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* all about the text field                                              */
    /*                                                                       */
    /* Das Textfield soll RichText beinhalten. Aus diesem Grund wird ein     */
    /* foreignObject verwendet, welches ein komplettes HTML-Dokument         */
    /* beinhaltet.Der Body des Elements wird mit dem Quill-Editor bearbeitet,*/
    /* dieser verwendet im HTML einige Quill-Spazifischen CSS-Klassen. Um    */
    /* diese rendern zu können, werden im embedded document die verwendeten  */
    /* Quill-Styles definiert                                                */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    private static TEXTFIELD_HTML_TEMPLATE = `
        <html  xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <style>
               * {box-sizing:border-box;}
               html,body { background-color: transparent; overflow: auto; max-height: 100%;}
               p { margin: 0 !important; }
               .ql-align-center { text-align: center; }
               .ql-align-right { text-align: right; }
               .ql-align-justify { text-align: justify; }
               .ql-size-small { font-size: 12px; }
               .ql-size-large { font-size: 24px; }
               .ql-size-huge { font-size: 32px; }
               
               .textfield { display: inline-block; padding: 5px; background-color: transparent; position: absolute;}
               .textFieldTopLeft {top: 0; left: 0 }
               .textFieldTopCenter {top: 0; left: 50%; transform: translateX(-50% );}
               .textFieldTopRight {top: 0; right: 0; }
               .textFieldCenterLeft {top: 50%; transform: translateY(-50%); }
               .textFieldCenterCenter {top: 50%; left: 50%; transform: translate(-50%, -50%); }
               .textFieldCenterRight {top: 50%; right: 0; transform: translateY(-50%); }
               .textFieldBottomLeft {bottom: 0; left: 0 }
               .textFieldBottomCenter {bottom: 0; left: 50%; transform: translateX(-50% ); }
               .textFieldBottomRight {bottom: 0; right: 0; }
            </style>
          </head>
          <body>
              <div class="textfield textFieldCenterCenter"></div>
          </body>
        </html>
    `;

    /**
     * 
     */
    get textContent(): string {
        return this.textField.innerHTML;
    }

    /**
     * 
    */
    set textContent(text: string) {

        this.textField.innerHTML = text;
    }

    set textAlignment(val: string) {

        this.textField.setAttribute('class', 'textfield ' + val);
    }

    get textAlignment(): string {

        const classes = this.textField.getAttribute('class')!.split(' ');
        const idx = classes.indexOf('textfield');
        if (idx !== -1) {
            classes.splice(idx, 1);
        }
        return classes.length ? classes[0] : 'textfieldSenterCenter';
    }

    private get textField(): Element {

        return this.textFieldCnr.querySelector('.textfield')!;
    }

    /**
     * Das TextField besteht aus einem foreignObject, welches ein komplettes HTML-Dokument
     * beinhaltet. Das ist notwendig, um die Style-Elemente des QuillEditors injizieren zu können.
     */
    private createTextField(): SVGForeignObjectElement {

        const textFieldCnr = document.createElementNS(AbstractShape.SVG_NAMESPACE, "foreignObject") as SVGForeignObjectElement;
        textFieldCnr.setAttribute('x', '0');
        textFieldCnr.setAttribute('y', '0');

        const dom = new DOMParser().parseFromString(AbstractShape.TEXTFIELD_HTML_TEMPLATE, 'text/html');
        textFieldCnr.appendChild(dom.documentElement);

        return textFieldCnr;
    }


    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    protected abstract onResizeImpl(newWidth: number, newHeight: number): void;

    /**
     * Erzeugt den outer container.
     * 
     * Dieser dient in erster Linie dazu, das eigentliche SVGElement,
     * die Connectoren und ggf den DecoratorFrame zu gruppieren und
     * gemeinsam verschieben zu können.
     * @returns 
     */
    private createElementContainer(): SVGGElement {

        const group = document.createElementNS(AbstractShape.SVG_NAMESPACE, "g") as SVGGElement;

        let transform = this.svgRoot.createSVGTransform();
        transform.setTranslate(0, 0);
        group.transform.baseVal.appendItem(transform);
        return group;
    }

    /**
    * Erzeuge einen ResizeAnchor
    */
    protected createResizeAnchor(dir: DragDirection) {

        const anchor = new DragAnchor(this.svgRoot, this, dir);
        this.dragAnchorsGroup.appendChild(anchor.svgElement);
        return anchor;
    }

    private addClass(elem: Element, clazz: string) {

        const clazzes = (elem.getAttribute('class') || '').split(' ');
        if (clazzes.indexOf(clazz) === -1) {
            clazzes.push(clazz);
            elem.setAttribute('class', clazzes.join(' '));
        }
    }

    private removeClass(elem: Element, clazz: string) {

        let clazzes = (elem.getAttribute('class') || '').split(' ');
        const idx = clazzes.indexOf(clazz);
        if (idx !== -1) {
            clazzes.splice(idx, 1);
            elem.setAttribute('class', clazzes.join(' '));
        }
    }
}
