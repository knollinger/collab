import { AbstractShape } from "../drawables/shapes/abstractshape";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

export class DragShapesGlassPane extends AbstractGlassPane {

    constructor(
        private model: WhiteboardModel) {
        super(model.svgRoot);
    }

    override onMouseMove(evt: MouseEvent) {

        this.model.moveSelectedShapes(evt.movementX, evt.movementY);
    }

    override onMouseUp(evt: MouseEvent) {
        this.dismiss();
    }
}