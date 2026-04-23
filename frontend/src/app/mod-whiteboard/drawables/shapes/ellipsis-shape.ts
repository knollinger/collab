import { AbstractShape, IShapeJSON } from "./abstractshape";

/**
 * 
 */
export class EllipsisShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super('ellipse', svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'ellipse') as SVGGraphicsElement);
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

    /**
     * 
     * @param svgRoot 
     * @param json 
     * @returns 
     */
    public static fromJSON(svgRoot: SVGSVGElement, json: IShapeJSON): EllipsisShape {
        const shape = new EllipsisShape(svgRoot);
        shape.loadJSONProps(json);
        return shape;
    }
}