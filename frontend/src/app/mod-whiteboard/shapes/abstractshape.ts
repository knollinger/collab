import { WhiteboardContextMenuComponent } from "../components/whiteboard-context-menu/whiteboard-context-menu.component";

export abstract class AbstractShape {

    public static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    private width: number = 100;
    private height: number = 100;
    private elemCnr: SVGGElement;
    private decorator: SVGGElement | null = null;
    private isDragging: boolean = false;

    /**
     * 
     * @param svgRoot 
     */
    constructor(
        protected svgRoot: SVGSVGElement,
        protected svgElem: SVGGraphicsElement) {

        this.svgElem.setAttribute('fill', 'white');
        this.svgElem.setAttribute('stroke-width', '1');
        this.svgElem.setAttribute('stroke', 'black');

        this.svgElem.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.svgElem.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.svgElem.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.svgElem.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.svgElem.addEventListener('focus', this.onFocus.bind(this));
        this.svgElem.addEventListener('blur', this.onBlur.bind(this));
        this.svgElem.tabIndex = 0;

        this.elemCnr = this.createElementContainer();
        this.elemCnr.appendChild(this.svgElem);
        this.svgRoot.appendChild(this.elemCnr);
    }

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
            frame.setAttribute('width', '116');
            frame.setAttribute('height', '116');
            frame.setAttribute('stroke', 'lightgray');
            frame.setAttribute('stroke-width', '2');
            frame.setAttribute('stroke-dasharray', '2 2');
            frame.setAttribute('fill', 'transparent');
            this.decorator.appendChild(frame);

            this.decorator.appendChild(this.createResizeAnchor(-12, -12, 'nw'));
            this.decorator.appendChild(this.createResizeAnchor(-12, 46, 'w'));
            this.decorator.appendChild(this.createResizeAnchor(-12, 104, 'sw'));
            this.decorator.appendChild(this.createResizeAnchor(46, -12, 'n'));
            this.decorator.appendChild(this.createResizeAnchor(46, 104, 's'));
            this.decorator.appendChild(this.createResizeAnchor(104, -12, 'ne'));
            this.decorator.appendChild(this.createResizeAnchor(104, 46, 'e'));
            this.decorator.appendChild(this.createResizeAnchor(104, 104, 'se'));

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
    * @param name 
    * @returns 
    */
    private createResizeAnchor(x: number, y: number, name: string): SVGElement {

        const anchor = document.createElementNS(AbstractShape.SVG_NAMESPACE, "rect") as SVGGElement;
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
            this.onStartResize(anchor, this.svgElem, evt);
        });
        anchor.addEventListener('mousemove', evt => {
            this.onResize(anchor, this.svgElem, evt)
        });
        anchor.addEventListener('mouseup', evt => {
            this.onStopResize(anchor, this.svgElem, evt)
        });
        return anchor;
    }

    /**
     * Beginne das draggen eines ResizeAnchors
     * 
     * @param anchor 
     */
    private onStartResize(anchor: SVGElement, svgElem: SVGGraphicsElement, evt: MouseEvent) {
        evt.stopPropagation();
        svgElem.focus();
    }

    /**
     * Ein Resize-Anchor wird gedragged
     * 
     * @param anchor 
     * @param evt 
     */
    private onResize(anchor: SVGElement, svgElem: SVGGraphicsElement, evt: MouseEvent) {

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
    private onStopResize(anchor: SVGElement, svgElem: SVGGraphicsElement, evt: MouseEvent) {

        evt.stopPropagation();
    }

    /**
     * 
     * @param evt 
     */
    private onMouseDown(evt: MouseEvent) {
        evt.preventDefault();
        this.svgElem.focus();
        this.isDragging = true;
    }

    /**
     * 
     * @param evt 
     */
    private onMouseMove(evt: MouseEvent) {

        if (this.isDragging) {

            for (let i = 0; i < this.elemCnr.transform.baseVal.length; ++i) {

                const transform = this.elemCnr.transform.baseVal.getItem(i);
                if (transform.type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {

                    const x = transform.matrix.e + evt.movementX;
                    const y = transform.matrix.f + evt.movementY;
                    transform.setTranslate(x, y);
                }
            }
        }
    }

    /**
     * 
     * @param evt 
     */
    private onMouseUp(evt: MouseEvent) {
        this.isDragging = false;
    }

    /**
     * 
     * @param evt 
     */
    private onMouseLeave(evt: MouseEvent) {
        this.isDragging = false;
    }

    /**
     * 
     */
    private onFocus() {
        this.createDecoratorFrame();
    }

    /**
     * 
     */
    private onBlur() {
        this.removeDecoratorFrame();
        this.isDragging = false;
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    abstract onResizeImpl(newWidth: number, newHeight: number): void;
}