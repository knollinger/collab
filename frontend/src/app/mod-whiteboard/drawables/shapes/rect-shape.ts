import { DragAnchor, DragDirection } from "../anchors/drag-anchor";
import { AbstractShape, IShapeJSON } from "./abstractshape";

/**
 * 
 */
export class RectShape extends AbstractShape {

    private resizeNorthAnchor: DragAnchor;
    private resizeNorthWestAnchor: DragAnchor;
    private resizeNorthEastAnchor: DragAnchor;
    private resizeSouthAnchor: DragAnchor;
    private resizeSouthWestAnchor: DragAnchor;
    private resizeSouthEastAnchor: DragAnchor;
    private resizeWestAnchor: DragAnchor;
    private resizeEastAnchor: DragAnchor;

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        super('rect', svgRoot, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'rect') as SVGGraphicsElement);

        this.resizeNorthAnchor = this.createResizeAnchor('n');
        this.resizeNorthWestAnchor = this.createResizeAnchor('nw');
        this.resizeNorthEastAnchor = this.createResizeAnchor('ne');
        this.resizeSouthAnchor = this.createResizeAnchor('s');
        this.resizeSouthWestAnchor = this.createResizeAnchor('sw');
        this.resizeSouthEastAnchor = this.createResizeAnchor('se');
        this.resizeWestAnchor = this.createResizeAnchor('w');
        this.resizeEastAnchor = this.createResizeAnchor('e');
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    onResizeImpl(newWidth: number, newHeight: number): void {

        this.svgElem.setAttribute('width', newWidth.toString());
        this.svgElem.setAttribute('height', newHeight.toString());

        this.resizeNorthAnchor.setPosition(newWidth / 2, 0);
        this.resizeNorthWestAnchor.setPosition(0, 0);
        this.resizeNorthEastAnchor.setPosition(newWidth, 0);
        this.resizeSouthAnchor.setPosition(newWidth / 2, newHeight);
        this.resizeSouthWestAnchor.setPosition(0, newHeight);
        this.resizeSouthEastAnchor.setPosition(newWidth, newHeight);
        this.resizeWestAnchor.setPosition(0, newHeight / 2);
        this.resizeEastAnchor.setPosition(newWidth, newHeight / 2);
    }

    /**
     * 
     * @param svgRoot 
     * @param json 
     * @returns 
     */
    public static fromJSON(svgRoot: SVGSVGElement, json: IShapeJSON): RectShape {
        const shape = new RectShape(svgRoot);
        shape.loadJSONProps(json);
        return shape;
    }

}