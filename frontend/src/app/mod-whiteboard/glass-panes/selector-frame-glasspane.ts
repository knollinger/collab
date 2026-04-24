import { AbstractShape } from "../drawables/shapes/abstractshape";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractGlassPane } from "./abstract-glasspane";

/**
 * Eine GlassPane, welche einen SelectorFrame aufspannen kann.
 * 
 * Wir implementieren hier nur onMouseMove, der Rest kann durch die 
 * Default-Implementierungen erledigt werden (welche einfach nichts tun).
 */
export class SelectorFrameGlassPane extends AbstractGlassPane {

    private frame: SVGRectElement;

    /**
     * 
     * @param shapes 
     */
    constructor(
        private model: WhiteboardModel,
        private startX: number,
        private startY: number,) {

        super(model.svgRoot);

        this.frame = document.createElementNS(AbstractGlassPane.SVG_NAMESPACE, 'rect') as SVGRectElement;
        this.frame.setAttribute('x', `${startX}`);
        this.frame.setAttribute('y', `${startY}`);
        this.frame.setAttribute('fill', 'rgba(0, 0, 255, 0.3');
        this.frame.setAttribute('stroke', 'light');

        this.frame.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.frame.addEventListener('mouseup', this.onMouseUp.bind(this));

        model.svgRoot.appendChild(this.frame);
    }

    /**
     * 
     * @param evt 
     */
    override onMouseMove(evt: MouseEvent) {

        const currX = Number.parseInt(this.frame.getAttribute('x')!);
        const currY = Number.parseInt(this.frame.getAttribute('y')!);

        const width = evt.offsetX - currX;
        const height = evt.offsetY - currY;
                 
        this.frame.setAttribute('width', `${width}`);
        this.frame.setAttribute('height', `${height}`);
        this.model.selectByFrame(currX, currY, width, height);
    }

    /**
     * 
     * @param evt 
     */
    override onMouseUp(evt: MouseEvent) {
        console.log('mouseUp');
        this.frame.remove();
        this.glassPaneElem.remove();
    }
}