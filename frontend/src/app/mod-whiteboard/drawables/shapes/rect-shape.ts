import { WhiteboardModel } from "../../models/whiteboard-model";
import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class RectShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(model: WhiteboardModel) {

        super(model, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'rect') as SVGGraphicsElement);
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