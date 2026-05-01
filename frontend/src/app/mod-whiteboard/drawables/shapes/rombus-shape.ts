import { DragAnchor, DragDirection } from "../anchors/drag-anchor";
import { AbstractShape, IShapeJSON } from "./abstractshape";

/**
 * 
 */
export class RombusShape extends AbstractShape {

    private resizeNorthAnchor: DragAnchor;
    private resizeSouthAnchor: DragAnchor;
    private resizeWestAnchor: DragAnchor;
    private resizeEastAnchor: DragAnchor;

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super('rombus', svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGGraphicsElement);

        this.resizeNorthAnchor = this.createResizeAnchor('n');
        this.resizeSouthAnchor = this.createResizeAnchor('s');
        this.resizeWestAnchor = this.createResizeAnchor('w');
        this.resizeEastAnchor = this.createResizeAnchor('e');
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(newWidth: number, newHeight: number): void {

        const points = `${newWidth / 2},0 ${newWidth}, ${newHeight / 2} ${newWidth / 2},${newHeight} 0,${newHeight / 2}`;
        this.svgElem.setAttribute('points', points);

        this.resizeNorthAnchor.setPosition(newWidth / 2, 0);
        this.resizeSouthAnchor.setPosition(newWidth / 2, newHeight);
        this.resizeWestAnchor.setPosition(0, newHeight / 2);
        this.resizeEastAnchor.setPosition(newWidth, newHeight / 2);
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