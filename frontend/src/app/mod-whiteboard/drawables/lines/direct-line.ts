import { AbstractLine } from "./abstract-line";

/**
 * 
 */
export class DirectLine extends AbstractLine {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement, svgParent: SVGGElement) {
        super(svgRoot, svgParent, document.createElementNS(AbstractLine.SVG_NAMESPACE, 'line') as SVGPathElement);
    }

    /**
     * 
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    protected resizeLineImpl(x1: number, y1: number, x2: number, y2: number) {

        this.svgElem.setAttribute("x1", x1.toString());
        this.svgElem.setAttribute("y1", y1.toString());
        this.svgElem.setAttribute("x2", x2.toString());
        this.svgElem.setAttribute("y2", y2.toString());
    }
}