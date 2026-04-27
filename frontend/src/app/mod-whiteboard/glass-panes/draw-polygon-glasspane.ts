import { PolygoneShape } from "../drawables/shapes/polygone-shape";
import { AbstractGlassPane } from "./abstract-glasspane";

export class DrawPolygoneGlassPane extends AbstractGlassPane {

    constructor(
        svgRoot: SVGSVGElement,
        private shape: PolygoneShape) {

        super(svgRoot);
    }

    override onMouseMove(evt: MouseEvent) {

        const idx = this.shape.nrOfPoints - 1;
        if (idx >= 0) {
            this.shape.modifyPoint(idx, evt.offsetX, evt.offsetY);
        }
    }

    override onClick(evt: MouseEvent) {
        if (this.shape.nrOfPoints === 0) {
            this.shape.addPoint(evt.offsetX, evt.offsetY);
        }
        this.shape.addPoint(evt.offsetX, evt.offsetY);
    }

    override onDoubleClick(evt: MouseEvent) {

        this.shape.normalizePoints();
        this.dismiss();

    }



    override get hintText(): string | undefined {
        return 'Klicken um einen Punkt hinzu zu fügen, Doppel-Klicken um die Form abzuschließen';
    }

}