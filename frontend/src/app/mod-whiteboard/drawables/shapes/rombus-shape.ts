import { WhiteboardModel } from "../../models/whiteboard-model";
import { AbstractShape } from "./abstractshape";

/**
 * 
 */
export class RombusShape extends AbstractShape {

    /**
     * 
     * @param svgRoot 
     */
    constructor(typeName: string, model: WhiteboardModel) {

        super(typeName, model, document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGGraphicsElement);
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