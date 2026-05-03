import { AbstractShape } from "../drawables/shapes/abstractshape";
import { PolygoneShape } from "../drawables/shapes/polygone-shape";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

export class ResizeShapesGlassPane extends AbstractGlassPane {

    constructor(
        svgRoot: SVGSVGElement,
        private shape: AbstractShape,
        private mode: string,
        private context?: any) {
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

            case 'any':
                this.handlePointResize(deltaX, deltaY);
                break;
        }
    }

    private handlePointResize(deltaX: number, deltaY: number) {

        if(this.context) {

            if(deltaX || deltaY) {
            console.log(deltaX + ' /' + deltaY);
            }
            const polygone = this.shape as PolygoneShape;
            const idx = this.context as number;
            const point = polygone.getPoint(idx);
            point.x += deltaX;
            point.y += deltaY;
            polygone.modifyPoint(idx, point.x, point.y);
        }
    }

    override onMouseUp(evt: MouseEvent): void {
        this.dismiss();
    }
}