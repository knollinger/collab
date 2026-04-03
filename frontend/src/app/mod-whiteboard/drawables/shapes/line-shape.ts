import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class LineShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super(svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'line') as SVGGraphicsElement);
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(newWidth: number, newHeight: number): void {

        this.svgElem.setAttribute('x1', `0`);
        this.svgElem.setAttribute('y1', `0`);
        this.svgElem.setAttribute('x2', `${newWidth}`);
        this.svgElem.setAttribute('y2', `${newHeight}`);
    }
}