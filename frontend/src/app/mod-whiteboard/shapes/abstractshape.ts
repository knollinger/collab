
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

    public static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    private elemCnr: SVGGElement;
    private decorator: SVGGElement | null = null;

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
        private height: number) {

        this.svgElem.setAttribute('fill', 'white');
        this.svgElem.setAttribute('stroke-width', '1');
        this.svgElem.setAttribute('stroke', 'black');
        this.svgElem.addEventListener('mousedown', evt => {
            evt.stopPropagation();
            this._onMouseDown(evt as MouseEvent, this);
        });

        this.elemCnr = this.createElementContainer(x, y);
        this.elemCnr.appendChild(this.svgElem);
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
        }
        else {
            this.removeDecoratorFrame();
        }
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
     * Erzeugt den outer container.
     * 
     * Dieser dient in erster Linie dazu, das eigentliche SVGElement,
     * die Connectoren und ggf den DecoratorFrame zu gruppieren und
     * gemeinsam verschieben zu können.
     * @returns 
     */
    private createElementContainer(x: number, y: number): SVGGElement {

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
            frame.setAttribute('x', '-8');
            frame.setAttribute('y', '-8');
            frame.setAttribute('width', `${this.width + 16}`);
            frame.setAttribute('height', `${this.height + 16}`);
            frame.setAttribute('stroke', 'lightgray');
            frame.setAttribute('stroke-width', '2');
            frame.setAttribute('stroke-dasharray', '2 2');
            frame.setAttribute('fill', 'transparent');
            this.decorator.appendChild(frame);

            this.decorator.appendChild(this.createResizeAnchor(-12, -12, 'nw'));
            this.decorator.appendChild(this.createResizeAnchor(-12, this.height / 2 - 4, 'w'));
            this.decorator.appendChild(this.createResizeAnchor(-12, this.height + 4, 'sw'));
            this.decorator.appendChild(this.createResizeAnchor(this.width / 2 - 4, -12, 'n'));
            this.decorator.appendChild(this.createResizeAnchor(this.width / 2 - 4, this.height + 4, 's'));
            this.decorator.appendChild(this.createResizeAnchor(this.width + 4, -12, 'ne'));
            this.decorator.appendChild(this.createResizeAnchor(this.width + 4, this.height / 2 - 4, 'e'));
            this.decorator.appendChild(this.createResizeAnchor(this.width + 4, this.height + 4, 'se'));

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
        anchor.setAttribute('stroke', "black");
        anchor.setAttribute('stroke-width', "1");
        anchor.setAttribute('fill', "green");
        anchor.setAttribute('class', `resize drag-${type}`)

        anchor.addEventListener('mousedown', evt => {
            evt.stopPropagation();
            this._onStartResize(evt, this, type);
        });
        return anchor;
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
}