import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class LineShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement, x: number, y: number, width: number, height: number) {

        super(svgRoot, LineShape.createShape(width, height), x, y, width, height);
    }

    /**
     * 
     * @returns 
     */
    private static createShape(width: number, height: number): SVGGraphicsElement {

        const elem = document.createElementNS(AbstractShape.SVG_NAMESPACE, 'line') as SVGGraphicsElement;
        elem.setAttribute('x1', `0`);
        elem.setAttribute('y1', `0`);
        elem.setAttribute('x2', `${width}`);
        elem.setAttribute('y2', `${height}`);
        return elem;
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