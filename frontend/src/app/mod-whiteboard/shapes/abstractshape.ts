
export interface MouseDownCallback {
    (evt: MouseEvent, shape: AbstractShape): void;
}

export interface StartResizeCallback {
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
    private static CONNECTOR_ANCHOR_RADIUS = 4;

    private elemCnr: SVGGElement;
    private decorator: SVGGElement | null = null;
    private connectors: SVGGElement | null = null;
    private textFieldCnr: SVGForeignObjectElement | null = null;

    private _onMouseDown: MouseDownCallback = () => { };
    private _onStartResize: StartResizeCallback = () => { };


    /**
     * 
     * @param svgRoot 
     */
    constructor(
        protected svgRoot: SVGSVGElement,
        public readonly svgElem: SVGGraphicsElement,
        private x: number,
        private y: number,
        private width: number,
        private height: number,
        private text?: string) {

        this.svgElem.setAttribute('fill', 'white');
        this.svgElem.setAttribute('stroke-width', '1');
        this.svgElem.setAttribute('stroke', 'black');
        this.svgElem.addEventListener('mousedown', evt => {
            evt.stopPropagation();
            this._onMouseDown(evt as MouseEvent, this);
        });

        this.elemCnr = this.createElementContainer(x, y, width, height);
        this.elemCnr.appendChild(this.svgElem);

        this.createTextField();
        this.svgRoot.appendChild(this.elemCnr);
    }

    /**
     * setze den MouseDown-Callback
     */
    public set onMouseDown(callback: MouseDownCallback) {
        this._onMouseDown = callback;
    }


    /**
     * setze den MouseDown-Callback
     */
    public set onStartResize(callback: StartResizeCallback) {
        this._onStartResize = callback;
    }

    /**
     * 
     * @param val 
     */
    public setSelected(val: boolean) {
        if (val) {
            this.createDecoratorFrame();
            this.createConnectors();
        }
        else {
            this.removeDecoratorFrame();
            this.removeConnectors();
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

        const minX = Math.min(this.x, x);
        const maxX = Math.max(this.x + this.width, x + width);
        const minY = Math.min(this.y, y);
        const maxY = Math.max(this.y + this.height, y + height);

        return (maxX - minX) <= (this.width + width) &&
            (maxY - minY) <= (this.height + height);
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

        return this.x >= x &&
               this.x + this.width <= x + width &&
               this.y >= y &&
               this.y + this.height <= y + height;
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

        for (let i = 0; i < this.elemCnr.transform.baseVal.length; ++i) {

            const transform = this.elemCnr.transform.baseVal.getItem(i);
            if (transform.type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {

                const x = transform.matrix.e + movementX;
                const y = transform.matrix.f + movementY;
                transform.setTranslate(x, y);

                this.x += movementX;
                this.y += movementY;
                
            }
        }
    }

    /**
     * 
     * @param resizeX 
     * @param resizeY 
     */
    public resizeBy(resizeX: number, resizeY: number) {

        const newWidth = this.width + resizeX;
        const newHeight = this.height + resizeY;

        if (newWidth >= 0 && newHeight >= 0) {

            this.width = newWidth;
            this.height = newHeight;

            if (this.decorator) {
                this.removeDecoratorFrame();
                this.createDecoratorFrame();
            }

            if (this.connectors) {
                this.removeConnectors();
                this.createConnectors();
            }
            this.onResizeImpl(this.width, this.height);
        }
    }

    /**
     * 
     * @param color 
     */
    public setFillColor(color: string) {
        this.svgElem.setAttribute('fill', color);
    }

    /**
     * 
     * @param color 
     */
    public setBorderColor(color: string) {

        if (this.svgElem) {
            this.svgElem.setAttribute('stroke', color);
        }
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
            frame.setAttribute('width', `${this.width + AbstractShape.DECORATOR_PADDING * 2}`);
            frame.setAttribute('height', `${this.height + AbstractShape.DECORATOR_PADDING * 2}`);
            frame.setAttribute('class', 'decorator-frame');
            this.decorator.appendChild(frame);

            this.decorator.appendChild(this.createResizeAnchor(
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_WIDTH / 2),
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_HEIGHT / 2),
                'nw'));

            this.decorator.appendChild(this.createResizeAnchor(
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_WIDTH / 2),
                this.height / 2 - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'w'));

            this.decorator.appendChild(this.createResizeAnchor(
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_WIDTH / 2),
                this.height + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'sw'));

            this.decorator.appendChild(this.createResizeAnchor(
                this.width / 2 - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_HEIGHT / 2),
                'n'));

            this.decorator.appendChild(this.createResizeAnchor(
                this.width / 2 - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                this.height + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                's'));

            this.decorator.appendChild(this.createResizeAnchor(
                this.width + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                -(AbstractShape.DECORATOR_PADDING + AbstractShape.RESIZE_ANCHOR_HEIGHT / 2),
                'ne'));

            this.decorator.appendChild(this.createResizeAnchor(
                this.width + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                this.height / 2 - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
                'e'));

            this.decorator.appendChild(this.createResizeAnchor(
                this.width + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_WIDTH / 2,
                this.height + AbstractShape.DECORATOR_PADDING - AbstractShape.RESIZE_ANCHOR_HEIGHT / 2,
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

            this.connectors.appendChild(this.createConnectorAnchor(this.width / 2, 0, 'n'));
            this.connectors.appendChild(this.createConnectorAnchor(this.width, this.height / 2, 'w'));
            this.connectors.appendChild(this.createConnectorAnchor(this.width / 2, this.height, 'n'));
            this.connectors.appendChild(this.createConnectorAnchor(0, this.height / 2, 'e'));
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
            this.textFieldCnr.setAttribute('width', `${this.width}`);
            this.textFieldCnr.setAttribute('height', `${this.height}`);

            const textField = document.createElement('div');
            textField.setAttribute('contentEditable', 'true');
            textField.setAttribute('width', `${this.width}`);
            textField.setAttribute('height', `${this.width}`);
            textField.setAttribute('class', 'text-field');
            textField.textContent = 'Test';
            this.textFieldCnr.appendChild(textField);

            // this.elemCnr.appendChild(this.textFieldCnr);
        }
    }
}
