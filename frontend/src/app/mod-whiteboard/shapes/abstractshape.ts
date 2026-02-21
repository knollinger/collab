
export interface MouseDownCallback {
    (evt: MouseEvent, shape: AbstractShape): void;
}

export interface StartResizeCallback {
    (evt: MouseEvent, shape: AbstractShape, mode: string): void;
}

export interface StartConnectCallback {
    (evt: MouseEvent, shape: AbstractShape, mode: string): void;
}

/**
 * 
 */
export abstract class AbstractShape {

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    private static DECORATOR_PADDING = 16;
    private static RESIZE_ANCHOR_WIDTH = 8;
    private static RESIZE_ANCHOR_HEIGHT = 8;
    private static CONNECTOR_ANCHOR_RADIUS = 5;

    private elemCnr: SVGGElement;
    private decorator: SVGGElement | null = null;
    private connectors: SVGGElement | null = null;
    private textFieldCnr: SVGForeignObjectElement | null = null;

    private _onStartDrag: MouseDownCallback = () => { };
    private _onStartResize: StartResizeCallback = () => { };
    private _onStartConnect: StartConnectCallback = () => { };
    private _onShowCtxMenu: MouseDownCallback = () => { };


    /**
     * 
     * @param svgRoot 
     */
    constructor(
        protected svgRoot: SVGSVGElement,
        public readonly svgElem: SVGGraphicsElement,
        private _x: number,
        private _y: number,
        private _width: number,
        private _height: number,
        private _text?: string) {

        this.svgElem.setAttribute('fill', '#ffffff');
        this.svgElem.setAttribute('stroke-width', '1');
        this.svgElem.setAttribute('stroke', '#000000');
        this.svgElem.addEventListener('mousedown', evt => {
            evt.stopPropagation();
            this._onStartDrag(evt as MouseEvent, this);
        });

        this.svgElem.addEventListener('mousemove', evt => this.createConnectors());
        this.svgElem.addEventListener('mouseleave', evt => this.removeConnectors());

        this.svgElem.addEventListener('contextmenu', evt => {
            evt.stopPropagation();
            this._onShowCtxMenu(evt as MouseEvent, this);
        });

        this.svgElem.setAttribute('filter', 'drop-shadow(5px 5px 2px rgb(0 0 0 /  0.2)');

        this.elemCnr = this.createElementContainer(_x, _y, _width, _height);
        this.elemCnr.appendChild(this.svgElem);

        this.createTextField();
        this.svgRoot.appendChild(this.elemCnr);
    }

    /**
     * setze den MouseDown-Callback
     */
    public set onStartDrag(callback: MouseDownCallback) {
        this._onStartDrag = callback;
    }

    /**
     * setze den StartResize-Callback
     */
    public set onStartResize(callback: StartResizeCallback) {
        this._onStartResize = callback;
    }

    /**
     * setze den StartResize-Callback
     */
    public set onStartConnect(callback: StartConnectCallback) {
        this._onStartConnect = callback;
    }

    /**
     * setze den ContextMenu-Callback
     */
    public set onShowCtxMenu(callback: MouseDownCallback) {
        this._onShowCtxMenu = callback;
    }

    /**
     * 
     * @param val 
     */
    public setSelected(val: boolean) {

        if (val) {
            this.createDecoratorFrame();
        }
        else {
            this.removeDecoratorFrame();
        }
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
    public get posX(): number {

        return this._x;
    }

    /**
     * 
     */
    public set posX(val: number) {

        this._x = val;
        this.findTranslateTransformation().setTranslate(this._x, this._y);
    }

    /**
     * 
     */
    public get posY(): number {

        return this._y;
    }

    /**
     * 
     */
    public set posY(val: number) {
        this._y = val;
        this.findTranslateTransformation().setTranslate(this._x, this._y);
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

    public get width(): number {
        return this._width;
    }

    public set width(val: number) {
        this._width = val;
        this.resize();
    }

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

        if (this.decorator) {
            this.removeDecoratorFrame();
            this.createDecoratorFrame();
        }

        if (this.connectors) {
            this.removeConnectors();
            this.createConnectors();
        }
        this.onResizeImpl(this._width, this._height);
    }

    /**
     * 
     */
    public delete() {
        this.elemCnr.remove();
    }

    /**
     * 
     * @param color 
     */
    public setFillColor(color: string) {
        this.svgElem.setAttribute('fill', color);
    }

    public fillColor(): string {
        return this.svgElem.getAttribute('fill') || '#ffffff';
    }

    /**
     * 
     * @param color 
     */
    public setBorderColor(color: string) {

        if (this.svgElem) {

            this.svgElem.setAttribute('stroke', color);
            this.svgElem.setAttribute('filter', `drop-shadow(5px 5px 2px rgb(from ${color} r g b / 0.2))`);
        }
    }

    public borderColor(): string {
        return this.svgElem.getAttribute('stroke') || '#000000';
    }

    /**
     * 
     * @param style 
     */
    public setBorderStyle(style: string) {

        if (this.svgElem) {

            const width = Number.parseInt(this.svgElem.getAttribute('stroke-width') || '1');

            switch (style) {
                case 'solid':
                    this.svgElem.removeAttribute('stroke-dasharray');
                    break;

                case 'dotted':
                    this.svgElem.setAttribute('stroke-dasharray', `${width} ${width}`);
                    break;

                case 'dashed':
                    this.svgElem.setAttribute('stroke-dasharray', '8 8');
                    break;
            }
        }
    }

    /**
     * 
     * @param width 
     */
    public setBorderWidth(width: number) {

        if (this.svgElem) {
            this.svgElem.setAttribute('stroke-width', width.toString());
        }
    }

    public borderWidth(): number {

        const result = this.svgElem.getAttribute('stroke-width') || '1';
        return Number.parseInt(result);
    }

    /**
     * verschiebe das Element um eine Ebene nach hinten
     */
    changeZOrderBack() {
        this.svgRoot.insertBefore(this.elemCnr, this.elemCnr.previousSibling);
    }

    /**
     * verschiebe das Element ganz nach hinten
     */
    changeZOrderBackground() {
        this.svgRoot.insertBefore(this.elemCnr, this.svgRoot.firstChild);
    }

    /**
     * verschiebe das Element um eine Ebene nach vorn
     */
    changeZOrderFore() {
        if (this.elemCnr.nextSibling) {
            this.svgRoot.insertBefore(this.elemCnr.nextSibling, this.elemCnr);
        }
        else {
            this.svgRoot.appendChild(this.elemCnr);
        }
    }

    /**
     * verschiebe das Element ganz nach vorn
     */
    changeZOrderForeground() {
        this.svgRoot.appendChild(this.elemCnr);
    }

    /**
     * Lösche das Element
     */
    remove() {
        this.elemCnr.remove();
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    abstract onResizeImpl(newWidth: number, newHeight: number): void;

    /**
     * Erzeugt den outer container.
     * 
     * Dieser dient in erster Linie dazu, das eigentliche SVGElement,
     * die Connectoren und ggf den DecoratorFrame zu gruppieren und
     * gemeinsam verschieben zu können.
     * @returns 
     */
    private createElementContainer(x: number, y: number, width: number, height: number): SVGGElement {

        const group = document.createElementNS(AbstractShape.SVG_NAMESPACE, "g") as SVGGElement;

        let transform = this.svgRoot.createSVGTransform();
        transform.setTranslate(x, y);
        group.transform.baseVal.appendItem(transform);
        return group;
    }

    /**
     * Erzeuge den DekoratorFrame, dieser wird zum skalieren benötigt.
     * 
     * Der DecoratorFrame zeichnet ein dotted rechtangle um das eigentliche
     * SVGElement mit 8px Abstand. Auf die Ecken und auf die Mitte der 
     * Frame-Seiten werden DrawAnchors gesetzt.
     * 
     * @param elem 
     */
    private createDecoratorFrame() {

        if (!this.decorator) {

            this.decorator = document.createElementNS(AbstractShape.SVG_NAMESPACE, "g") as SVGGElement;

            const frame = document.createElementNS(AbstractShape.SVG_NAMESPACE, "rect") as SVGGElement;
            frame.setAttribute('x', `${-AbstractShape.DECORATOR_PADDING}`);
            frame.setAttribute('y', `${-AbstractShape.DECORATOR_PADDING}`);
            frame.setAttribute('width', `${this._width + AbstractShape.DECORATOR_PADDING * 2}`);
            frame.setAttribute('height', `${this._height + AbstractShape.DECORATOR_PADDING * 2}`);
            frame.setAttribute('class', 'decorator-frame');
            this.decorator.appendChild(frame);

            this.decorator.appendChild(this.createResizeAnchor(
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_WIDTH / 2),
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_HEIGHT / 2),
                'nw'));

            this.decorator.appendChild(this.createResizeAnchor(
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_WIDTH / 2),
                this._height / 2 - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'w'));

            this.decorator.appendChild(this.createResizeAnchor(
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_WIDTH / 2),
                this._height + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'sw'));

            this.decorator.appendChild(this.createResizeAnchor(
                this._width / 2 - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_HEIGHT / 2),
                'n'));

            this.decorator.appendChild(this.createResizeAnchor(
                this._width / 2 - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                this._height + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                's'));

            this.decorator.appendChild(this.createResizeAnchor(
                this._width + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_HEIGHT / 2),
                'ne'));

            this.decorator.appendChild(this.createResizeAnchor(
                this._width + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                this._height / 2 - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'e'));

            this.decorator.appendChild(this.createResizeAnchor(
                this._width + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                this._height + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'se'));

            this.elemCnr.insertBefore(this.decorator, this.elemCnr.firstChild);
        }
    }

    /**
     * Entferne den DecoratorFrame und alle ResizeAnchors
     * 
     * @param elem 
     */
    removeDecoratorFrame() {

        if (this.decorator) {
            this.decorator.remove();
            this.decorator = null;
        }
    }

    /**
    * Erzeuge einen ResizeAnchor
    * 
    * @param x 
    * @param y 
    * @param type 
    * @returns 
    */
    private createResizeAnchor(x: number, y: number, type: string): SVGElement {

        const anchor = document.createElementNS(AbstractShape.SVG_NAMESPACE, "rect") as SVGGElement;
        anchor.setAttribute('name', type);
        anchor.setAttribute('x', x.toString());
        anchor.setAttribute('y', y.toString());
        anchor.setAttribute('width', "8");
        anchor.setAttribute('height', "8");
        anchor.setAttribute('class', `resize drag-${type}`)

        anchor.addEventListener('mousedown', evt => {
            evt.stopPropagation();
            this._onStartResize(evt, this, type);
        });
        return anchor;
    }

    /**
     * 
     */
    private createConnectors() {

        if (!this.connectors) {

            this.connectors = document.createElementNS(AbstractShape.SVG_NAMESPACE, "g") as SVGGElement;

            this.connectors.appendChild(this.createConnectorAnchor(this._width / 2, 0, 'n'));
            this.connectors.appendChild(this.createConnectorAnchor(this._width, this._height / 2, 'e'));
            this.connectors.appendChild(this.createConnectorAnchor(this._width / 2, this._height, 's'));
            this.connectors.appendChild(this.createConnectorAnchor(0, this._height / 2, 'w'));
            this.elemCnr.appendChild(this.connectors);
        }
    }

    /**
     * 
     */
    private removeConnectors() {

        if (this.connectors) {
            this.connectors.remove();
            this.connectors = null;
        }
    }

    private createConnectorAnchor(x: number, y: number, type: string): SVGElement {

        const anchor = document.createElementNS(AbstractShape.SVG_NAMESPACE, "ellipse") as SVGGElement;
        anchor.setAttribute('cx', `${x}`);
        anchor.setAttribute('cy', `${y}`);
        anchor.setAttribute('rx', `${AbstractShape.CONNECTOR_ANCHOR_RADIUS}`);
        anchor.setAttribute('ry', `${AbstractShape.CONNECTOR_ANCHOR_RADIUS}`);
        anchor.setAttribute('class', "connector");

        // Das schaut jetzt komisch aus: 
        // 
        // * Die Maus kann aber aus dem eigentlichen Shape auf den Connector wechseln, 
        //   dann passiert erst mal "mouseleave" auf dem shape und dadurch werden die 
        //   connectoren entfernt :-(
        // * Die Maus kann aber auch von einem connector ins "off" wandern, dann müssen
        //   die connectoren entfernt werden.
        //
        anchor.addEventListener('mousedown', (evt: MouseEvent) => {
            evt.stopPropagation();
            this._onStartConnect(evt, this, type);
        })
        anchor.addEventListener('mousemove', evt => this.createConnectors());
        anchor.addEventListener('mouseleave', evt => this.removeConnectors());
        return anchor;
    }

    /**
     * 
     */
    private createTextField() {

        if (!this.textFieldCnr) {

            this.textFieldCnr = document.createElementNS(AbstractShape.SVG_NAMESPACE, "foreignObject") as SVGForeignObjectElement;
            this.textFieldCnr.setAttribute('x', '0');
            this.textFieldCnr.setAttribute('y', '0');
            this.textFieldCnr.setAttribute('width', `${this._width}`);
            this.textFieldCnr.setAttribute('height', `${this._height}`);

            const textField = document.createElement('div');
            textField.setAttribute('contentEditable', 'true');
            textField.setAttribute('width', `${this._width}`);
            textField.setAttribute('height', `${this._width}`);
            textField.setAttribute('class', 'text-field');
            textField.textContent = 'Test';
            this.textFieldCnr.appendChild(textField);

            // this.elemCnr.appendChild(this.textFieldCnr);
        }
    }
}
