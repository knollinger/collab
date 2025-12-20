import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class EllipsisShape extends AbstractShape {
    
    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement, width: number, height: number) {

        super(svgRoot, EllipsisShape.createShape(width, height));
    }

    /**
     * 
     * @returns 
     */
    private static createShape(width: number, height: number): SVGGraphicsElement {

       const elem = document.createElementNS(AbstractShape.SVG_NAMESPACE, 'ellipse') as SVGGraphicsElement;
       elem.setAttribute('cx', `${width / 2}`);
       elem.setAttribute('cy', `${height / 2}`);
       elem.setAttribute('rx', `${width / 2}`);
       elem.setAttribute('ry', `${height / 2}`);
       return elem;
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(newWidth: number, newHeight: number): void {

       this.svgElem.setAttribute('cx', `${newWidth / 2}`);
       this.svgElem.setAttribute('cy', `${newHeight / 2}`);
       this.svgElem.setAttribute('rx', `${newWidth / 2}`);
       this.svgElem.setAttribute('ry', `${newHeight / 2}`);
    }
}