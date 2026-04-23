import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractFillEffect, IFillEffectJSON } from "./abstract-fill-effect";

export type EGradientFillDirection = 'TopDown' | 'LeftRight' | 'Diagonal' | 'Radial';


export interface IGradientFillEffectJSON extends IFillEffectJSON {
    direction: EGradientFillDirection,
    color1: string,
    color2: string
}

/**
 * 
 */
export class GradientFillEffect extends AbstractFillEffect {

    constructor(typeName: string,
        private direction: EGradientFillDirection,
        private color1: string,
        private color2: string) {

        super(typeName, GradientFillEffect.createGradient(direction, color1, color2));
    }

    /**
     * 
     * @param direction 
     * @param color1 
     * @param color2 
     * @returns 
     */
    private static createGradient(direction: EGradientFillDirection, color1: string, color2: string): SVGElement {

        let gradient: SVGElement;
        switch (direction) {
            case 'TopDown':
                gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'linearGradient') as SVGLinearGradientElement;
                gradient.setAttribute('x1', '0');
                gradient.setAttribute('x2', '0');
                gradient.setAttribute('y1', '0');
                gradient.setAttribute('y2', '100%');
                break;

            case 'LeftRight':
                gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'linearGradient') as SVGLinearGradientElement;
                gradient.setAttribute('x1', '0');
                gradient.setAttribute('x2', '100%');
                gradient.setAttribute('y1', '0');
                gradient.setAttribute('y2', '0');
                break;

            case 'Diagonal':
                gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'linearGradient') as SVGLinearGradientElement;
                gradient.setAttribute('x1', '0');
                gradient.setAttribute('x2', '100%');
                gradient.setAttribute('y1', '0');
                gradient.setAttribute('y2', '100%');
                break;

            case 'Radial':
                gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'radialGradient') as SVGRadialGradientElement;
                gradient.setAttribute('cx', '50%');
                gradient.setAttribute('cy', '50%');
                gradient.setAttribute('r', '100%');
                gradient.setAttribute('fx', '50%');
                gradient.setAttribute('fy', '50%');
                break;
        }

        const startColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        startColor.setAttribute('offset', '0%');
        startColor.setAttribute('stop-color', color1);

        const endColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        endColor.setAttribute('offset', '100%');
        endColor.setAttribute('stop-color', color2);

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

    /**
     * 
     * @returns 
     */
    public toJSON(): IGradientFillEffectJSON {

        return {
            id: this.id,
            type: this.typeName,
            direction: this.direction,
            color1: this.color1,
            color2: this.color2
        }
    }

    public static fromJSON(json: IGradientFillEffectJSON): GradientFillEffect {
        return new GradientFillEffect(json.type, json.direction, json.color1, json.color2);
    }
}