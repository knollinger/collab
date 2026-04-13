import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractFillEffect } from "./abstract-fill-effect";

export class GradientTopDownFillEffect extends AbstractFillEffect {


    constructor(model: WhiteboardModel, color1: string, color2: string) {

        super(model, GradientTopDownFillEffect.createGradient(color1, color2));
    }

    static createGradient(color1: string, color2: string): SVGElement {

        const startColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        startColor.setAttribute('offset', '0%');
        startColor.setAttribute('stop-color', color1);
        
        const endColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        endColor.setAttribute('offset', '100%');
        endColor.setAttribute('stop-color', color2);

        const gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'linearGradient') as SVGLinearGradientElement;
        gradient.setAttribute('x1', '0');
        gradient.setAttribute('x2', '0');
        gradient.setAttribute('y1', '0');
        gradient.setAttribute('y2', '100%');

        gradient.appendChild(startColor);
        gradient.appendChild(endColor);

        return gradient;
    }


    public set width(width: number) {
        // nothing to do
    }
    public set height(height: number) {
        // nothing to do
    }
}