import { AbstractLine } from "../drawables/lines/abstract-line";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

export class DragLineGlassPane extends AbstractGlassPane {

    constructor(
        svgRoot: SVGSVGElement,
        private line: AbstractLine,
        private type: string) {
        super(svgRoot);
    }

    override onMouseMove(evt: MouseEvent) {

        let x1 = this.line.x1;
        let y1 = this.line.y1;
        let x2 = this.line.x2;
        let y2 = this.line.y2;

        switch (this.type) {
            case 'start':
                x1 += evt.movementX;
                y1 += evt.movementY;                
                break;

            case 'end':
                x2 += evt.movementX;
                y2 += evt.movementY;                
                break;
        }

        this.line.resizeLine(x1, y1, x2, y2);
    }
}