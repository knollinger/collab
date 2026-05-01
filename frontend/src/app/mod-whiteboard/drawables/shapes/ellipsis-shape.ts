import { DragAnchor, DragDirection } from "../anchors/drag-anchor";
import { AbstractShape, IShapeJSON } from "./abstractshape";

/**
 * 
 */
export class EllipsisShape extends AbstractShape {

    private resizeNorthAnchor: DragAnchor;
    private resizeSouthAnchor: DragAnchor;
    private resizeWestAnchor: DragAnchor;
    private resizeEastAnchor: DragAnchor;

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super('ellipse', svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'ellipse') as SVGGraphicsElement);
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

        this.svgElem.setAttribute('cx', `${newWidth / 2}`);
        this.svgElem.setAttribute('cy', `${newHeight / 2}`);
        this.svgElem.setAttribute('rx', `${newWidth / 2}`);
        this.svgElem.setAttribute('ry', `${newHeight / 2}`);

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
    public static fromJSON(svgRoot: SVGSVGElement, json: IShapeJSON): EllipsisShape {
        const shape = new EllipsisShape(svgRoot);
        shape.loadJSONProps(json);
        return shape;
    }
}