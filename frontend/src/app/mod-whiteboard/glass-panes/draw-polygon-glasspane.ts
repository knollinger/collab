import { WhiteboardModel } from '../models/whiteboard-model';
import { PolygoneShape, IPolygonePoint } from "../drawables/shapes/polygone-shape";
import { AbstractGlassPane } from "./abstract-glasspane";

export interface IShapeCreatedCallback {
    (shape: PolygoneShape): void
}

/**
 * Die DrawPolygoneGlasspane 
 */
export class DrawPolygoneGlassPane extends AbstractGlassPane {

    private previewSVG: SVGPolygonElement;
    private points: IPolygonePoint[] = new Array<IPolygonePoint>();

    /**
     * 
     * @param model 
     * @param onShapeCreated 
     */
    constructor(
        private model: WhiteboardModel,
        private onShapeCreated: IShapeCreatedCallback) {

        super(model.svgRoot);

        this.previewSVG = document.createElementNS(DrawPolygoneGlassPane.SVG_NAMESPACE, 'polygon') as SVGPolygonElement;
        this.previewSVG.setAttribute('stroke', '#000000');
        this.previewSVG.setAttribute('stroke-width', '1');
        this.previewSVG.setAttribute('fill', 'transparent');

        this.model.svgRoot.insertBefore(this.previewSVG, this.glassPaneHost);
    }

    override onMouseMove(evt: MouseEvent) {

        const idx = this.points.length - 1;
        if (idx >= 0) {

            this.points[idx].x = evt.offsetX;
            this.points[idx].y = evt.offsetY;
            this.recalcPointsAttr();
        }
    }

    override onClick(evt: MouseEvent) {

        if (this.points.length === 0) {
            this.points.push({ x: evt.offsetX, y: evt.offsetY });
        }
        this.points.push({ x: evt.offsetX, y: evt.offsetY });
        this.recalcPointsAttr();
    }

    override onDoubleClick(evt: MouseEvent) {

        // Ein Doppelklick hat vorher 2 Click-Events ausgelöst, welche
        // Dummerweise den letzten Punkt jeweils injected haben
        // Also erstmal das PointArray shapen
        this.points.splice(this.points.length - 2);

        this.createShape();
        this.previewSVG.remove();
        this.dismiss();

    }

    // Berechne das "points-Attribut" für das PreviewSVG neu
    private recalcPointsAttr() {

        let attr = '';
        this.points.forEach(point => {
            attr += `${point.x},${point.y} `;
        })
        this.previewSVG.setAttribute('points', attr.trim());
    }

    /**
     * Erzeuge das eigentliche Shape.
     * 
     * Dazu werden die Points in den Bereich 0, 0-w,h normalisiert
     */
    private createShape() {

        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;

        this.points.forEach(point => {
            minX = Math.min(point.x, minX);
            minY = Math.min(point.y, minY);
        })

        const shape = new PolygoneShape(this.model.svgRoot);

        this.points.forEach(point => {
            shape.addPoint(point.x - minX, point.y - minY);
        })

        shape.posX = minX;
        shape.posY = minY;

        this.model.addShape(shape);        
        this.onShapeCreated(shape);
    }

    override get hintText(): string | undefined {
        return 'Klicken um einen Punkt hinzu zu fügen, Doppel-Klicken um die Form abzuschließen';
    }

}