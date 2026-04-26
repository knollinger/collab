import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

export class ResizeShapesGlassPane extends AbstractGlassPane {

    constructor(
        private model: WhiteboardModel,
        private resizeType: string) {
        super(model.svgRoot);
    }

    override onMouseMove(evt: MouseEvent) {

        this.model.resizeSelectedShapes(this.resizeType, evt.movementX, evt.movementY);
    }

    override onMouseUp(evt: MouseEvent): void {
        this.dismiss();    
    }
}