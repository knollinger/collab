import { PolyLine } from "../drawables/lines/polyline";
import { AbstractGlassPane } from "./abstract-glasspane";

export class DrawLineGlassPane extends AbstractGlassPane {

    constructor(
        svgRoot: SVGSVGElement,
        private line: PolyLine) {
        super(svgRoot);
    }

    override onMouseMove(evt: MouseEvent) {

        const idx = this.line.nrOfPoints - 1;
        if (idx >= 0) {
            this.line.modifyPoint(idx, evt.offsetX, evt.offsetY);
        }
    }

    override onClick(evt: MouseEvent) {
        if(this.line.nrOfPoints === 0) {
        this.line.addPoint(evt.offsetX, evt.offsetY);
        }
        this.line.addPoint(evt.offsetX, evt.offsetY);
    }

    override onDoubleClick(evt: MouseEvent) {
        this.dismiss();

    }
}