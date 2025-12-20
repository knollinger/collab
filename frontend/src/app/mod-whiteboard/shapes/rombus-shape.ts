import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class RombusShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement, width: number, height: number) {

        super(svgRoot, RombusShape.createShape(width, height));
    }

    /**
     * 
     * @returns 
     */
    private static createShape(width: number, height: number): SVGGraphicsElement {

        const elem = document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGGraphicsElement;

        const points = `${width / 2},0 ${width}, ${height / 2} ${width / 2},${height} 0,${height / 2}`;
        elem.setAttribute('points', points);
        return elem;
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(newWidth: number, newHeight: number): void {

        const points = `${newWidth / 2},0 ${newWidth}, ${newHeight / 2} ${newWidth / 2},${newHeight} 0,${newHeight / 2}`;
        this.svgElem.setAttribute('points', points);
    }
}