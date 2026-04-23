export enum ConnectorMarkerType {
    NONE,
    ARROW,
    CIRCLE,
    RECT,
    DIAMOND
}

/**
 * Die Basis aller Connectoren
 * 
 * Jeder Connector besteht aus einem SVGPath und den Markern für Start und End.
 * Der Pfad und die Marker werden in der selben Farbe gezeichnet.
 * 
 *  
 * 
 */
export abstract class AbstractLine {

    private static DEFAULT_COLOR: string = '#000000';
    private static MARKER_URIS: Map<ConnectorMarkerType, string> = new Map<ConnectorMarkerType, string>(
        [
            [ConnectorMarkerType.ARROW, 'url(#marker-arrow)'],
            [ConnectorMarkerType.CIRCLE, 'url(#marker-circle)'],
            [ConnectorMarkerType.DIAMOND, 'url(#marker-diamond)'],
            [ConnectorMarkerType.RECT, 'url(#marker-rect)']
        ]
    );

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    public markerStart: ConnectorMarkerType = ConnectorMarkerType.NONE;
    public markerEnd: ConnectorMarkerType = ConnectorMarkerType.NONE;
    public readonly groupElem: SVGGElement;

    private x1: number = 20;
    private y1: number = 20;
    private x2: number = 0;
    private y2: number = 0;
    private startAnchor: SVGGraphicsElement;
    private endAnchor: SVGGraphicsElement;

    /**
     * 
     * @param svgRoot 
     * @param svgElem 
     */
    constructor(
        public readonly svgRoot: SVGSVGElement,
        public readonly svgElem: SVGGraphicsElement) {

        this.svgElem.setAttribute('fill', '#ffffff');
        this.svgElem.setAttribute('stroke-width', '3');
        this.svgElem.setAttribute('stroke', '#000000');

        this.svgElem.addEventListener('mousemove', () => {
            this.showAnchors();
        })

        this.svgElem.addEventListener('mouseleave', () => {
            this.removeAnchors();
        })

        this.groupElem = document.createElementNS(AbstractLine.SVG_NAMESPACE, 'g') as SVGGElement;
        this.groupElem.appendChild(this.svgElem);

        this.startAnchor = this.createResizeAnchor(this.x1 - 4, this.y1 - 4, 'start');
        this.groupElem.appendChild(this.startAnchor);

        this.endAnchor = this.createResizeAnchor(this.x2 - 4, this.y2 - 4, 'end');
        this.groupElem.appendChild(this.endAnchor);

        this.color = AbstractLine.DEFAULT_COLOR;
        this.startMarker = ConnectorMarkerType.NONE;
        this.endMarker = ConnectorMarkerType.NONE;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about colors                                                      */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     */
    public set color(color: string) {
        this.svgElem.setAttribute('stroke', color);
    }

    /**
     * 
     */
    public get color(): string {
        return this.svgElem.getAttribute('stroke') || '#000000';
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about start markers                                               */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/
    private _startMarker: ConnectorMarkerType = ConnectorMarkerType.NONE;
    private _endMarker: ConnectorMarkerType = ConnectorMarkerType.NONE;

    /**
     * 
     */
    public set startMarker(type: ConnectorMarkerType) {
        this._startMarker = type;
        this.setMarkerAttr('marker-start', type);
    }

    /**
     * 
     */
    public get startMarker(): ConnectorMarkerType {
        return this._startMarker;
    }

    /**
     * 
     */
    public set endMarker(type: ConnectorMarkerType) {
        this._endMarker = type;
        this.setMarkerAttr('marker-end', type);
    }

    /**
     * 
     */
    public get endMarker(): ConnectorMarkerType {
        return this._endMarker;
    }

    /**
     * Hilfs-Methode zum setzen des MarkerTypes für Start und End.
     * 
     * Wenn der angegebene Type === NONE ist, wird das Attribut aus dem
     * Path-Element gelöscht. Anderenfalls wird aus dem Typ die URL
     * für den Marker unter //defs ermittelt und in das Attribut geschrieben.
     *  
     * @param attrName 
     * @param type 
     */
    private setMarkerAttr(attrName: string, type: ConnectorMarkerType) {

        const refUrl = AbstractLine.MARKER_URIS.get(type);
        if (type === ConnectorMarkerType.NONE || !refUrl) {
            this.svgElem.removeAttribute(attrName);
        }
        else {
            this.svgElem.setAttribute(attrName, refUrl);
        }
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about path points                                                 */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     */
    public resizeLine(x1: number, y1: number, x2: number, y2: number) {

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.resizeLineImpl(x1, y1, x2, y2);

        this.startAnchor.setAttribute("x", (x1 - 4).toString());
        this.startAnchor.setAttribute("y", (y1 - 4).toString());
        this.endAnchor.setAttribute("x", (x2 - 4).toString());
        this.endAnchor.setAttribute("y", (y2 - 4).toString());
    }

    /**
     * 
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    protected abstract resizeLineImpl(x1: number, y1: number, x2: number, y2: number): void;

    /**
     * 
     */
    private showAnchors() {

        this.removeClass(this.startAnchor, 'hidden');
        this.removeClass(this.endAnchor, 'hidden');
    }

    /**
     * 
     */
    private removeAnchors() {

        this.addClass(this.startAnchor, 'hidden');
        this.addClass(this.endAnchor, 'hidden');
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param type 
     * @returns 
     */
    private createResizeAnchor(x: number, y: number, type: string): SVGGraphicsElement {

        const anchor = document.createElementNS(AbstractLine.SVG_NAMESPACE, "rect") as SVGRectElement;
        anchor.setAttribute('name', type);
        anchor.setAttribute('x', x.toString());
        anchor.setAttribute('y', y.toString());
        anchor.setAttribute('width', "8");
        anchor.setAttribute('height', "8");
        anchor.setAttribute('class', `resize hidden`)

        //
        // Einen Functor als Callback bauen!
        //

        anchor.addEventListener('mousedown', evt => {
            evt.stopPropagation();
        });
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