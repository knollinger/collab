import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class ParallelogramShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super(svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGGraphicsElement);
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