import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractFillEffect, IFillEffectJSON } from "./abstract-fill-effect";
import { EGradientFillDirection, GradientFillEffect } from "./gradient-fill-effect";

export interface IColorFillEffectJSON extends IFillEffectJSON {
    color: string
}

/**
 * Der ColorFillEffect setzt eigentlich nur eine Hintergrund-Farbe...eigentlich
 * könnte man am Shape einfach "fill: #myColor" setzen.
 * 
 * FillEffekte werden in den AbstractShapes aber als Referenzen auf Resourcen
 * im "//svg/defs"-Knoten implementiert. Aus diesem Grund wird der ColorFillEffect
 * als GradientFillEffect implementiert. Ist doof....aber was solls.
 * 
 * Wir könnten jetzt direkt von ein GradientFillEffect ableiten, dann schaut 
 * aber die JSON-Presentation unschön aus.
 */
export class ColorFillEffect extends AbstractFillEffect {

    /**
     * 
     * @param typeName 
     * @param model 
     * @param color 
     */
    constructor(typeName: string, private color: string) {
        super(typeName, ColorFillEffect.createGradient(color));
    }

    /**
     * 
     * @param color 
     * @returns 
     */
    private static createGradient(color: string): SVGElement {

        const gradient = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'linearGradient') as SVGLinearGradientElement;
        gradient.setAttribute('x1', '0');
        gradient.setAttribute('y1', '0');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const startColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        startColor.setAttribute('offset', '0%');
        startColor.setAttribute('stop-color', color);

        const endColor = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'stop') as SVGStopElement;
        endColor.setAttribute('offset', '100%');
        endColor.setAttribute('stop-color', color);

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
     * Überführe den FillEffect in die JSON-Notation.
     * 
     * @returns 
     */
    public toJSON(): IColorFillEffectJSON {

        return {
            id: this.id,
            type: this.typeName,
            color: this.color
        }
    }

    public static fromJSON(json: IColorFillEffectJSON): ColorFillEffect {

        return new ColorFillEffect(json.type, json.color);
    }

}