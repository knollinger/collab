import { AbstractShape } from "../drawables/shapes/abstractshape";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

/**
 * 
 */
export class DragShapesGlassPane extends AbstractGlassPane {

    /**
     * 
     * @param model 
     */
    constructor(
        private model: WhiteboardModel) {
        super(model.svgRoot);

        this.glassPaneElem.style.cursor = 'move';
    }

    /**
     * 
     * @param evt 
     */
    override onMouseMove(evt: MouseEvent) {

        this.model.moveSelectedShapes(evt.movementX, evt.movementY);
    }

    /**
     * 
     * @param evt 
     */
    override onMouseUp(evt: MouseEvent) {
        this.dismiss();
    }
}