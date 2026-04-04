import { WhiteboardDocument } from "../models/whiteboard-document";
import { AbstractFillEffect } from "./abstract-fill-effect";

export class GradientRadialFillEffect extends AbstractFillEffect {

    constructor(model: WhiteboardDocument, color1: string, color2: string) {

        super(model, GradientRadialFillEffect.createGradient(color1, color2));

    }

    private static createGradient(color1: string, color2: string): SVGRadialGradientElement {

        const startColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        startColor.setAttribute('offset', '0%');
        startColor.setAttribute('stop-color', color1);
        
        const endColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        endColor.setAttribute('offset', '100%');
        endColor.setAttribute('stop-color', color2);

        const gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'radialGradient') as SVGRadialGradientElement;
        gradient.setAttribute('cx', '50%');
        gradient.setAttribute('cy', '50%');
        gradient.setAttribute('r', '50%');
        gradient.setAttribute('fx', '50%');
        gradient.setAttribute('fy', '50%');

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