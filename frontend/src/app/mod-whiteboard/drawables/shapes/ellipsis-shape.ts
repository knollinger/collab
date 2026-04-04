import { WhiteboardDocument } from "../../models/whiteboard-document";
import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class EllipsisShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(model: WhiteboardDocument) {

        super(model, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'ellipse') as SVGGraphicsElement);
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