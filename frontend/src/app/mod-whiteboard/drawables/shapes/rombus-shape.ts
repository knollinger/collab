import { AbstractShape, IShapeJSON } from "./abstractshape";

/**
 * 
 */
export class RombusShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super('rombus', svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGGraphicsElement);
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

    /**
     * 
     * @param svgRoot 
     * @param json 
     * @returns 
     */
    public static fromJSON(svgRoot: SVGSVGElement, json: IShapeJSON): RombusShape {
        const shape = new RombusShape(svgRoot);
        shape.loadJSONProps(json);
        return shape;
    }
}