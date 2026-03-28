import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class ParallelogramShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement, x: number, y: number,  width: number, height: number) {

        super(svgRoot, ParallelogramShape.createShape(width, height), x, y, width, height);
    }

    /**
     * 
     * @returns 
     */
    private static createShape(width: number, height: number): SVGGraphicsElement {

        const elem = document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGGraphicsElement;

        const points = `${width * 0.25},0 0,${height} ${width * 0.75},${height} ${width},0`;
        elem.setAttribute('points', points);
        return elem;
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(width: number, height: number): void {

        const points = `${width * 0.25},0 0,${height} ${width * 0.75},${height} ${width},0`;
        this.svgElem.setAttribute('points', points);
    }
}