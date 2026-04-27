import { AbstractShape } from "../drawables/shapes/abstractshape";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

export class CreateShapeGlassPane extends AbstractGlassPane {

    private isDragging: boolean = false;

    constructor(
        private model: WhiteboardModel,
        private shape: AbstractShape) {
        super(model.svgRoot);
    }

    override onMouseDown(evt: MouseEvent) {
        this.shape.posX = evt.offsetX;
        this.shape.posY = evt.offsetY;
        this.isDragging = true;
    }

    override onMouseMove(evt: MouseEvent) {

        if(this.isDragging) {

            this.shape.width += evt.movementX;
            this.shape.height += evt.movementY;
        }
    }

    override onMouseUp(evt: MouseEvent) {
        this.dismiss();
    }
}