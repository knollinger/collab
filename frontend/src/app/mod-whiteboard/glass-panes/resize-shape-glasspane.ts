import { AbstractShape } from "../drawables/shapes/abstractshape";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

export class ResizeShapesGlassPane extends AbstractGlassPane {

    constructor(
        svgRoot: SVGSVGElement,
        private shape: AbstractShape,
        private mode: string) {
        super(svgRoot);
    }

    override onMouseMove(evt: MouseEvent) {

        const deltaX = evt.movementX;
        const deltaY = evt.movementY;
        switch (this.mode) {
            case 'n':
                this.shape.translateBy(0, deltaY);
                this.shape.resizeBy(0, -deltaY);
                break;

            case 'ne':
                this.shape.translateBy(0, deltaY);
                this.shape.resizeBy(deltaX, -deltaY);
                break;

            case 'e':
                this.shape.resizeBy(deltaX, 0);
                break;

            case 'se':
                this.shape.resizeBy(deltaX, deltaY);
                break;

            case 's':
                this.shape.resizeBy(0, deltaY);
                break;

            case 'sw':
                this.shape.translateBy(deltaX, 0);
                this.shape.resizeBy(-deltaX, deltaY);
                break;

            case 'w':
                this.shape.translateBy(deltaX, 0);
                this.shape.resizeBy(-deltaX, 0);
                break;

            case 'nw':
                this.shape.translateBy(deltaX, deltaY);
                this.shape.resizeBy(-deltaX, -deltaY);
                break;
        }
    }

    override onMouseUp(evt: MouseEvent): void {
        this.dismiss();
    }
}