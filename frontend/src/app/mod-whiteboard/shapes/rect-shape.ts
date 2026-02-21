import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class RectShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement, x: number, y: number, width: number, height: number) {

        super(svgRoot, RectShape.createShape(width, height), x, y, width, height);
    }

    /**
     * 
     * @returns 
     */
    private static createShape(width: number, height: number): SVGGraphicsElement {

        const elem = document.createElementNS(AbstractShape.SVG_NAMESPACE, 'rect') as SVGGraphicsElement;
        elem.setAttribute('width', width.toString());
        elem.setAttribute('height', height.toString());
        return elem;
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(newWidth: number, newHeight: number): void {

        this.svgElem.setAttribute('width', newWidth.toString());
        this.svgElem.setAttribute('height', newHeight.toString());
    }
}